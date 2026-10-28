import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import type { ConsultationRequest } from './buildConsultation.ts';
import type { VisualAnswerResponse } from '../../types/visualAnswer.ts';

/**
 * Cache of validated answers for identical consultations (§17.7). The key covers everything an answer
 * depends on, so any change invalidates it automatically:
 *  - pipeline version (methodology + assessment rules), knowledge-base file versions;
 *  - normalised birth details (date, time, precision, coordinates, time zone);
 *  - normalised question; the calendar day (running Dasha and transits are date-dependent);
 *  - birth-detail corrections and, for follow-ups, the conversation so far.
 * The analytical conclusions are deterministic even without this cache; caching additionally keeps
 * the wording stable when the same question is asked again the same day.
 */
const MAX_ENTRIES = 300;
const TTL_MS = 12 * 3600 * 1000;
const store = new Map<string, { at: number; answer: VisualAnswerResponse }>();

function knowledgeVersion(): string {
  return ['curated_corpus.json', 'methodology_corpus.json']
    .map((f) => {
      try {
        return String(fs.statSync(path.resolve(process.cwd(), 'data/knowledge', f)).mtimeMs);
      } catch {
        return 'missing';
      }
    })
    .join(':');
}

export function normalizeQuestion(q: string): string {
  return q.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}

export function cacheKey(req: ConsultationRequest, pipelineVersion: string, isFollowUp: boolean, now: Date): string {
  const b = req.birthDetails;
  const parts = [
    pipelineVersion,
    knowledgeVersion(),
    b ? [b.birthDate, b.birthTime || '', b.birthTimePrecision || 'exact', b.latitude?.toFixed(4), b.longitude?.toFixed(4), b.timezone].join('|') : 'no-chart',
    normalizeQuestion(req.question || ''),
    now.toISOString().slice(0, 10),
    req.birthDetailsChanged ? JSON.stringify(req.birthDetailsChanged) : '',
    isFollowUp ? JSON.stringify((req.conversationHistory || []).map((h) => [h.role, h.content])) : '',
  ];
  return crypto.createHash('sha256').update(parts.join('␟')).digest('hex');
}

export function getCachedAnswer(key: string): VisualAnswerResponse | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > TTL_MS) {
    store.delete(key);
    return null;
  }
  store.delete(key);
  store.set(key, hit); // refresh LRU position
  return hit.answer;
}

export function setCachedAnswer(key: string, answer: VisualAnswerResponse): void {
  store.set(key, { at: Date.now(), answer });
  while (store.size > MAX_ENTRIES) store.delete(store.keys().next().value as string);
}

export function clearAnswerCache(): void {
  store.clear();
}
