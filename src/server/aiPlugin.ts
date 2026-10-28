import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';
import {
  prepareConsultation, finalizeAnswer, readingFromOutput, readingViolations, repairReading, repairInstruction,
  PIPELINE_VERSION, type ConsultationRequest,
} from './consultation/buildConsultation.ts';
import { READING_RESPONSE_SCHEMA, hasReadingOutput } from './consultation/responseContract.ts';
import { cacheKey, getCachedAnswer, setCachedAnswer } from './consultation/answerCache.ts';

const GENERATION_SEED = 7;
import type { VisualAnswerResponse } from '../types/visualAnswer.ts';
import { getManifestSummary, getMethodologyCorpus, getBookCorpus, searchBooks } from './consultation/knowledgeBase.ts';

interface AiConfig {
  primaryProvider: 'gemini' | 'qwen';
  geminiApiKey: string;
  geminiModel: string;
  geminiBaseUrl: string;
  qwenApiKey: string;
  qwenModel: string;
  qwenBaseUrl: string;
}

// Helper to load configuration from process.env and .env file
export function getAiConfig(): AiConfig {
  let primaryProvider: 'gemini' | 'qwen' = 'gemini';
  let geminiApiKey = process.env.GEMINI_API_KEY || '';
  let geminiModel = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';
  let geminiBaseUrl = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';

  let qwenApiKey = process.env.QWEN_API_KEY || '';
  let qwenModel = process.env.QWEN_MODEL || 'qwen/qwen3.8-27b';
  let qwenBaseUrl = process.env.QWEN_BASE_URL || 'https://openrouter.ai/api/v1';

  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
        const [rawKey, ...rest] = trimmed.split('=');
        const key = rawKey.trim();
        const value = rest.join('=').trim();

        if (key === 'PRIMARY_PROVIDER' && (value === 'gemini' || value === 'qwen')) {
          primaryProvider = value;
        } else if (key === 'GEMINI_API_KEY') {
          geminiApiKey = value;
        } else if (key === 'GEMINI_MODEL') {
          geminiModel = value;
        } else if (key === 'GEMINI_BASE_URL') {
          geminiBaseUrl = value;
        } else if (key === 'QWEN_API_KEY') {
          qwenApiKey = value;
        } else if (key === 'QWEN_MODEL') {
          qwenModel = value;
        } else if (key === 'QWEN_BASE_URL') {
          qwenBaseUrl = value;
        }
      }
    }
  } catch (e) {
    console.error('[Vyom AI] Failed reading .env file in aiPlugin:', e);
  }

  return {
    primaryProvider,
    geminiApiKey,
    geminiModel,
    geminiBaseUrl,
    qwenApiKey,
    qwenModel,
    qwenBaseUrl,
  };
}

// Cleanly extracts JSON from LLM output (removes markdown backticks, handles trailing tokens)
function extractJsonFromContent(raw: string): any {
  if (!raw) return null;
  let text = raw.trim();

  // Strip markdown code fences
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  }

  // Find outermost curly braces
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      // Proceed to healing
    }
  }

  try {
    return JSON.parse(text);
  } catch {
    // Progressive repair for truncated JSON
    try {
      let healed = text;
      const quoteMatches = healed.match(/"/g);
      if (quoteMatches && quoteMatches.length % 2 !== 0) {
        healed += '"';
      }
      const openBrackets = (healed.match(/\[/g) || []).length;
      const closeBrackets = (healed.match(/\]/g) || []).length;
      for (let i = 0; i < openBrackets - closeBrackets; i++) healed += ']';
      const openBraces = (healed.match(/\{/g) || []).length;
      const closeBraces = (healed.match(/\}/g) || []).length;
      for (let i = 0; i < openBraces - closeBraces; i++) healed += '}';
      return JSON.parse(healed);
    } catch {
      return null;
    }
  }
}

// Structured reading schema enforced in Gemini API (single response contract)
const geminiResponseSchema = READING_RESPONSE_SCHEMA;

// Primary Model Invoker: Google Gemini 3 Flash (Free-Tier Standard)
async function callGemini(
  config: AiConfig,
  systemPrompt: string,
  conversationHistory: Array<{ role: string; content?: string }>,
  question: string
): Promise<any | null> {
  if (!config.geminiApiKey) return null;

  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  // Conversation history arrives sanitized and truncated by prepareConsultation (map assistant -> model)
  for (const turn of conversationHistory || []) {
    if (turn.content && typeof turn.content === 'string') {
      contents.push({
        role: turn.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: turn.content }],
      });
    }
  }

  contents.push({
    role: 'user',
    parts: [{ text: question }],
  });

  // Priority free-tier Gemini models
  const modelsToTry = [
    config.geminiModel || 'gemini-3-flash-preview',
    'gemini-3-flash-preview',
    'gemini-2.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
  ].filter((v, i, a) => a.indexOf(v) === i);

  // Overall budget so a user never waits through every fallback model's full timeout
  const deadline = Date.now() + 100000;
  for (const modelName of modelsToTry) {
    if (Date.now() > deadline - 10000) break;
    try {
      const endpoint = `${config.geminiBaseUrl}/models/${modelName}:generateContent?key=${config.geminiApiKey}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), Math.min(50000, deadline - Date.now()));

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents,
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: geminiResponseSchema,
            // Low temperature and a fixed seed for repeatable wording; the analytical conclusions
            // themselves are fixed upstream by the deterministic assessment.
            temperature: 0.2,
            seed: GENERATION_SEED,
            maxOutputTokens: 8192,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        const data = (await response.json()) as {
          candidates?: Array<{
            content?: {
              parts?: Array<{ text?: string }>;
            };
          }>;
        };

        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const parsed = extractJsonFromContent(rawContent);
        if (parsed && typeof parsed === 'object') {
          console.log(`[Vyom AI] Successfully generated grounded consultation using ${modelName}`);
          return parsed;
        }
      } else {
        const errText = await response.text();
        console.warn(`[Vyom AI] Gemini ${modelName} returned HTTP ${response.status}:`, errText.slice(0, 160));
      }
    } catch (err: unknown) {
      console.warn(`[Vyom AI] Gemini attempt with ${modelName} failed:`, err instanceof Error ? err.message : String(err));
    }
  }

  return null;
}

// Secondary Fallback Provider: OpenRouter (Qwen)
async function callQwen(
  config: AiConfig,
  messages: Array<{ role: string; content: string }>
): Promise<any | null> {
  if (!config.qwenApiKey) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    const response = await fetch(`${config.qwenBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.qwenApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Vyom Vedic Astrology',
      },
      body: JSON.stringify({
        model: config.qwenModel,
        messages,
        temperature: 0.2,
        seed: GENERATION_SEED,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.ok) {
      const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const rawContent = data.choices?.[0]?.message?.content || '';
      const parsed = extractJsonFromContent(rawContent);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } else {
      console.warn(`[Vyom AI] Secondary provider returned HTTP ${response.status}:`, (await response.text()).slice(0, 160));
    }
  } catch (err) {
    console.warn('[Vyom AI] Secondary fallback (Qwen) failed:', err instanceof Error ? err.message : String(err));
  }

  return null;
}

/**
 * Full consultation path shared by the HTTP endpoint and the behavioural evaluation suite:
 * deterministic chart + rules → question routing → source retrieval → generation → validation.
 * Returns null when no provider produced a usable answer (no reading is ever fabricated).
 */
async function generate(config: AiConfig, systemPrompt: string, history: Array<{ role: string; content: string }>, question: string): Promise<any | null> {
  let parsed: any = null;
  if (config.primaryProvider === 'gemini' && config.geminiApiKey) {
    parsed = await callGemini(config, systemPrompt, history, question);
  }
  if (!parsed && config.qwenApiKey) {
    console.log('[Vyom AI] Shifting to secondary fallback provider...');
    parsed = await callQwen(config, [{ role: 'system', content: systemPrompt }, ...history, { role: 'user', content: question }]);
  }
  if (!parsed && config.primaryProvider === 'qwen' && config.geminiApiKey) {
    parsed = await callGemini(config, systemPrompt, history, question);
  }
  return parsed;
}

export interface ConsultationOptions {
  useCache?: boolean;
  /** Receives validation diagnostics (used by the evaluation suites). */
  onDiagnostics?: (d: { cacheHit: boolean; initialViolations: string[]; finalViolations: string[]; repaired: boolean }) => void;
}

/**
 * Full consultation path shared by the HTTP endpoint and the evaluation suites:
 * deterministic chart + rules + question assessment → routing → retrieval → generation →
 * validation against the chart (with one repair attempt) → cache.
 * Returns null when no provider produced a usable answer (no reading is ever fabricated).
 */
export async function runConsultation(payload: ConsultationRequest, config: AiConfig = getAiConfig(), options: ConsultationOptions = {}): Promise<VisualAnswerResponse | null> {
  const prepared = prepareConsultation(payload);
  const { systemPrompt, history, question } = prepared;
  const key = cacheKey(payload, PIPELINE_VERSION, prepared.route.isFollowUp, prepared.now);
  if (options.useCache !== false) {
    const cached = getCachedAnswer(key);
    if (cached) {
      options.onDiagnostics?.({ cacheHit: true, initialViolations: [], finalViolations: [], repaired: false });
      return cached;
    }
  }

  let parsed = await generate(config, systemPrompt, history, question);
  if (!parsed) return null;

  let reading = hasReadingOutput(parsed) ? readingFromOutput(parsed, prepared) : null;
  const initial = reading ? readingViolations(reading, prepared) : [];
  let violations = initial;
  let repaired = false;
  if (reading && violations.length) {
    console.warn(`[Vyom AI] Draft failed validation (${violations.map((v) => v.kind).join(', ')}); requesting a corrected answer.`);
    const retry = await generate(config, systemPrompt, [...history, { role: 'user', content: question }, { role: 'assistant', content: JSON.stringify(parsed) }], repairInstruction(violations));
    const retryReading = hasReadingOutput(retry) ? readingFromOutput(retry, prepared) : null;
    if (retryReading) {
      const retryViolations = readingViolations(retryReading, prepared);
      if (retryViolations.length < violations.length) {
        parsed = retry;
        reading = retryReading;
        violations = retryViolations;
      }
    }
    if (violations.length) {
      console.warn(`[Vyom AI] Removing ${violations.length} unsupported sentence(s) after repair.`);
      reading = repairReading(reading, violations, prepared);
    }
    repaired = true;
  }
  options.onDiagnostics?.({ cacheHit: false, initialViolations: initial.map((v) => `${v.kind}: ${v.detail}`), finalViolations: reading ? readingViolations(reading, prepared).map((v) => `${v.kind}: ${v.detail}`) : [], repaired });

  const answer = finalizeAnswer(parsed, prepared, hasReadingOutput(parsed) ? reading : undefined);
  if (!answer.summary && !answer.blocks.some((b) => b.type === 'markdown')) return null;
  setCachedAnswer(key, answer);
  return answer;
}

export function vyomAiPlugin(): Plugin {
  return {
    name: 'vyom-ai-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        // ═══ 1. RAG Status Endpoint ═══
        if (req.url === '/api/rag/status' && req.method === 'GET') {
          const config = getAiConfig();
          const corpus = getBookCorpus()?.items || [];
          let manifest: any[] = [];
          try {
            const manifestPath = path.resolve(process.cwd(), 'data/knowledge/library_manifest.json');
            if (fs.existsSync(manifestPath)) {
              manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            }
          } catch {
            manifest = [];
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              status: 'ready',
              consultationAvailable: !!(config.geminiApiKey || config.qwenApiKey),
              processDocuments: new Set((getMethodologyCorpus()?.items || []).map((m) => m.docId)).size,
              totalSources: manifest.length,
              totalCuratedChunks: corpus.length,
              indexedBooks: getManifestSummary(),
              sources: manifest.map((m: any) => ({
                id: m.id,
                title: m.title,
                author: m.author,
                tradition: m.tradition,
                totalChunks: m.totalChunks,
                fileSizeMb: m.fileSizeMb,
                categories: m.categories,
              })),
            })
          );
          return;
        }

        // ═══ 2. RAG Test Query Endpoint ═══
        if (req.url === '/api/rag/query' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { query } = JSON.parse(body || '{}');
              const passages = searchBooks({
                text: query || '',
                allowKinds: ['classical_vedic_primary', 'modern_vedic_pedagogy', 'philosophical_commentary', 'divination_compendium', 'western_esoteric'],
                maxResults: 6,
              }).map((p) => ({ title: p.title, author: p.author, chapter: [p.chapter, p.pages].filter(Boolean).join(' · '), page: p.pages, excerpt: p.excerpt, relevance: `Relevance ${p.score}` }));
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ query, count: passages.length, passages }));
            } catch (e) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON request' }));
            }
          });
          return;
        }

        // ═══ 3. Issue Reporting & Google Sheet Synchronization ═══
        if (req.url === '/api/feedback/report' && req.method === 'POST') {
          let reportBody = '';
          req.on('data', (chunk) => {
            reportBody += chunk;
          });

          req.on('end', async () => {
            try {
              const reportData = JSON.parse(reportBody || '{}');
              const reportEntry = {
                id: `ERR-${Date.now()}`,
                receivedAt: new Date().toISOString(),
                ...reportData,
              };

              // Persist locally
              const dataDir = path.resolve(process.cwd(), 'data');
              if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
              }
              const reportFilePath = path.join(dataDir, 'error_reports.json');
              let existingReports: any[] = [];
              if (fs.existsSync(reportFilePath)) {
                try {
                  existingReports = JSON.parse(fs.readFileSync(reportFilePath, 'utf-8'));
                } catch {
                  existingReports = [];
                }
              }
              existingReports.push(reportEntry);
              fs.writeFileSync(reportFilePath, JSON.stringify(existingReports, null, 2), 'utf-8');

              // Forward to Google Sheet Webhook if configured
              let sheetSynced = false;
              const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || '';
              if (webhookUrl) {
                try {
                  const sheetRes = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reportEntry),
                  });
                  sheetSynced = sheetRes.ok;
                } catch (sheetErr) {
                  console.error('[Vyom Reporter] Failed forwarding to Google Sheet Webhook:', sheetErr);
                }
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  status: 'success',
                  id: reportEntry.id,
                  sheetSynced,
                  message: 'Issue report successfully recorded.',
                })
              );
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Failed to record error report.' }));
            }
          });
          return;
        }

        // ═══ 4. Core AI Chat Consultation ═══
        if (req.url !== '/api/ai/chat' || req.method !== 'POST') {
          return next();
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const config = getAiConfig();

            // Verify API key presence
            if (!config.geminiApiKey && !config.qwenApiKey) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  error: 'Astrological consultation engine is not configured with an API key.',
                })
              );
              return;
            }

            const payload = JSON.parse(body || '{}') as ConsultationRequest;
            if (!payload.question || typeof payload.question !== 'string') {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Please enter a question.' }));
              return;
            }

            const cleanResponse = await runConsultation(payload, config);
            if (!cleanResponse) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'The consultation could not be completed right now. Please try asking again in a moment.' }));
              return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(cleanResponse));
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            console.error('AI Chat middleware exception:', errorMsg);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                error: 'Astrological consultation is momentarily experiencing high demand. Please try asking again.',
              })
            );
          }
        });
      });
    },
  };
}
