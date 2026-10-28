import { calculateNatalChart, type BirthCalculationInput } from '../../lib/astrology/calculations/chartEngine.ts';
import { analyzeVedicChart, type VedicAnalysis } from '../../lib/astrology/rules/vedicAnalysis.ts';
import { assessDomain, pickAssessmentDomain, ASSESSMENT_VERSION, type DomainAssessment } from '../../lib/astrology/rules/domainAssessment.ts';
import { buildReading, validateReading, removeViolations, readingToMarkdown, analysisSignature, hasReadingOutput, plainSummary, type ContractContext, type ReadingViolation } from './responseContract.ts';
import type { StructuredReading, VisualAnswerBlock, VisualAnswerResponse } from '../../types/visualAnswer.ts';
import { routeQuestion, type RoutedQuestion } from './questionRouter.ts';
import { CORE_PRINCIPLES, OUTPUT_CONTRACT, METHODOLOGY_VERSION, domainPlaybooks, routingDirectives } from './methodology.ts';
import { searchBooks, searchMethodology, type RetrievedPassage, type SourceKind } from './knowledgeBase.ts';

export interface ConsultationRequest {
  question: string;
  conversationHistory?: Array<{ role: string; content?: string }>;
  /** Birth details; the server recalculates the chart from these (authoritative). */
  birthDetails?: Omit<BirthCalculationInput, 'name'> & { name?: string };
  /** Set by the client when the saved birth details changed after earlier answers in this conversation. */
  birthDetailsChanged?: { previous: string; current: string; previousBirthDetails?: Omit<BirthCalculationInput, 'name'> } | null;
  now?: string;
}

export interface PreparedConsultation {
  systemPrompt: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  question: string;
  route: RoutedQuestion;
  analysis: VedicAnalysis | null;
  assessment: DomainAssessment | null;
  allowPrediction: boolean;
  now: Date;
  passages: RetrievedPassage[];
  methodologySections: string[];
  chartError?: string;
}

const MAX_HISTORY_TURNS = 12;
const MAX_TURN_CHARS = 2400;

// Query expansion for astrological vocabulary (kept from the original retrieval layer).
const ASTRO_SYNONYMS: Record<string, string[]> = {
  career: ['10th', 'tenth house', 'karma', 'profession', 'dasamsha'],
  job: ['10th', 'tenth house', '6th', 'service', 'profession'],
  marriage: ['7th', 'seventh house', 'kalatra', 'wife', 'husband', 'spouse', 'navamsa'],
  relationship: ['7th', 'seventh house', 'spouse', 'kalatra'],
  love: ['5th', '7th', 'venus'],
  wealth: ['2nd', '11th', 'dhana', 'wealth', 'gains'],
  money: ['2nd', '11th', 'dhana', 'wealth'],
  finance: ['2nd', '11th', 'dhana', 'wealth'],
  health: ['6th', '8th', 'disease', 'ascendant'],
  children: ['5th', 'fifth house', 'putra', 'progeny', 'jupiter'],
  education: ['4th', '5th', 'learning', 'mercury'],
  father: ['9th', 'sun', 'pitri'],
  mother: ['4th', 'moon', 'matri'],
  spiritual: ['9th', '12th', 'moksha', 'ketu', 'renunciation'],
  dasha: ['dasa', 'mahadasa', 'antardasa', 'bhukti', 'period'],
  transit: ['gochara', 'transit', 'moon sign'],
  manglik: ['mars', 'kuja', 'seventh', 'eighth'],
  palm: ['palmistry', 'hastarekha', 'lines', 'mounts'],
  numerology: ['numerology', 'number', 'mulank', 'bhagyank'],
  magic: ['astral light', 'magic', 'will'],
};

function allowedKinds(route: RoutedQuestion, question: string): SourceKind[] {
  const kinds: SourceKind[] = ['classical_vedic_primary', 'modern_vedic_pedagogy'];
  const c = new Set(route.categories);
  if (c.has('Q13_calculated_vs_interpreted') || c.has('concept_explanation')) kinds.push('philosophical_commentary');
  if (c.has('numerology_palmistry')) kinds.push('divination_compendium');
  if (c.has('occult_esoteric') || route.risks.includes('curse_black_magic')) kinds.push('western_esoteric');
  if (/\b(bowen|novel|antichrist)\b/i.test(question)) kinds.push('literary_fiction');
  return kinds;
}

function retrievalExpansions(question: string, route: RoutedQuestion, analysis: VedicAnalysis | null): string[] {
  const terms: string[] = [];
  for (const word of question.toLowerCase().split(/\W+/)) if (ASTRO_SYNONYMS[word]) terms.push(...ASTRO_SYNONYMS[word]);
  for (const d of route.domains) if (ASTRO_SYNONYMS[d === 'marriage' ? 'marriage' : d === 'family_children' ? 'children' : d === 'spirituality' ? 'spiritual' : d]) terms.push(...ASTRO_SYNONYMS[d === 'family_children' ? 'children' : d === 'spirituality' ? 'spiritual' : d]);
  if (analysis) {
    for (const r of analysis.rules) if (r.status !== 'suppressed') terms.push(r.name.split(/[—(]/)[0]);
    if (route.categories.includes('Q06_dasha_meaning') && analysis.dasha) terms.push(`${analysis.dasha.mahadasha} dasa`, `${analysis.dasha.antardasha ?? ''} bhukti`);
  }
  return terms;
}

function preferredProcessDocs(route: RoutedQuestion): number[] {
  const c = new Set(route.categories);
  const docs = new Set<number>();
  if (route.risks.length || c.has('Q13_calculated_vs_interpreted')) docs.add(10);
  if (c.has('dosha_remedy') || c.has('compatibility')) { docs.add(5); docs.add(6); }
  if (c.has('Q07_year_ahead') || c.has('Q08_transit') || c.has('Q06_dasha_meaning')) { docs.add(5); docs.add(6); }
  if (c.has('Q10_cross_tradition') || route.requestedTradition) { docs.add(4); docs.add(1); }
  if (c.has('Q02_lagna') || c.has('Q12_no_birth_time') || c.has('Q11_app_disagreement')) { docs.add(1); docs.add(2); }
  if (c.has('concept_explanation') || c.has('Q04_strengths')) docs.add(3);
  return [...docs];
}

/** Compact, name-free chart context for the interpreter (DOC 10 rule 12: no PII to the language layer). */
function chartContextFor(analysis: VedicAnalysis): string {
  const compact = {
    settings: analysis.settings,
    birthTimeWorkflow: analysis.workflow,
    lagna: analysis.lagna,
    chandraLagna: analysis.chandraLagna,
    suryaLagna: analysis.suryaLagna,
    planets: analysis.planets,
    houses: analysis.houses,
    housesFromMoon: analysis.housesFromMoon,
    rules: analysis.rules.map(({ ruleId: _ruleId, ...rest }) => rest),
    runningDasha: analysis.dasha,
    currentTransits: analysis.transits,
    notCalculated: analysis.notComputed,
  };
  return JSON.stringify(compact);
}

function sanitizeHistory(history: ConsultationRequest['conversationHistory']): PreparedConsultation['history'] {
  return (history || [])
    .filter((t) => t && typeof t.content === 'string' && t.content.trim())
    .slice(-MAX_HISTORY_TURNS)
    .map((t) => ({
      role: t.role === 'assistant' ? 'assistant' : 'user',
      content: t.content!.length > MAX_TURN_CHARS ? `${t.content!.slice(0, MAX_TURN_CHARS)} …` : t.content!,
    }));
}

export function prepareConsultation(req: ConsultationRequest): PreparedConsultation {
  const question = (req.question || '').trim();
  const history = sanitizeHistory(req.conversationHistory);
  const route = routeQuestion(question, history);
  const now = req.now ? new Date(req.now) : new Date();

  let analysis: VedicAnalysis | null = null;
  let assessment: DomainAssessment | null = null;
  let chartError: string | undefined;
  if (req.birthDetails) {
    try {
      const chart = calculateNatalChart({ ...req.birthDetails, name: 'native', now });
      analysis = analyzeVedicChart(chart, { now });
      const domain = pickAssessmentDomain(route.domains, route.isPersonal && !route.categories.includes('concept_explanation'));
      // No chart judgement at all for medical, longevity, fertility or crisis questions (DOCUMENT_08 Case 12)
      const noJudgement = route.risks.some((r) => ['medical', 'death_longevity', 'fertility_pregnancy', 'self_harm'].includes(r));
      if (domain && !noJudgement) assessment = assessDomain(chart, analysis, domain, now);
    } catch (e) {
      chartError = e instanceof Error ? e.message : String(e);
    }
  }

  const retrievalQuery = `${question} ${history.filter((h) => h.role === 'user').slice(-2).map((h) => h.content).join(' ')}`;
  const passages = searchBooks({
    text: retrievalQuery,
    expansions: retrievalExpansions(question, route, analysis),
    allowKinds: allowedKinds(route, question),
    maxResults: route.categories.includes('source_request') ? 8 : 6,
    maxPerBook: 2,
  });
  const methodology = searchMethodology(`${question} ${route.domains.join(' ')} ${route.categories.join(' ').replace(/_/g, ' ')}`, 2, preferredProcessDocs(route));

  // Outlooks are never offered for high-risk topics (DOCUMENT_10 §3.2) or health questions
  const allowPrediction = route.risks.length === 0 && !route.domains.includes('health');
  const sections: string[] = [CORE_PRINCIPLES];
  const directives = routingDirectives(route, { lagnaAvailable: !!analysis?.workflow.lagnaAvailable, hasChart: !!analysis, workflowId: analysis?.workflow.id });
  if (directives) sections.push(directives);
  const playbooks = domainPlaybooks(route.domains);
  if (playbooks) sections.push(playbooks);
  sections.push(`## Reference: relevant sections of the Vyom process documents\n${methodology.map((m) => `### ${m.docTitle} — ${m.section}\n${m.content.slice(0, 1500)}`).join('\n\n') || '(none)'}`);

  if (analysis) {
    sections.push(`## CALCULATED CHART (authoritative; the only source of chart facts)\nToday's date: ${now.toISOString().split('T')[0]}.\n${chartContextFor(analysis)}`);
  } else if (chartError) {
    sections.push(`## CALCULATED CHART\nThe saved birth details could not be calculated (${chartError}). Ask the user to check and re-enter them; make no chart claims.`);
  } else {
    sections.push('## CALCULATED CHART\nNone — the user has not provided birth details.');
  }
  if (assessment) {
    sections.push(`## ESTABLISHED ANALYSIS for this question (fixed — explain it, do not change it)\n${JSON.stringify({
      area: assessment.domainLabel,
      housesCountedFrom: assessment.reference === 'lagna' ? 'Lagna (rising sign)' : 'Moon sign (birth time unknown)',
      focusHouses: assessment.focusHouses,
      overallBalance: assessment.balance,
      confidence: assessment.confidence,
      confidenceReasons: assessment.confidenceReasons,
      factors: assessment.factors.map((f) => ({ id: f.id, role: f.role, weight: f.weight, plain: f.plain, technical: f.technical, sources: f.sources })),
      timing: { assessable: assessment.timing.assessable, note: assessment.timing.reason, windows: assessment.timing.windows.map((w) => ({ id: w.id, start: w.start, end: w.end, period: w.period, strength: w.strength, why: w.why })) },
      missingInformation: assessment.missingInformation,
      predictionAllowed: allowPrediction,
    })}`);
    // Consistency with earlier answers in this conversation (§17.4–17.6)
    const current = analysisSignature(assessment)!;
    const earlier = history.filter((h) => h.role === 'assistant').map((h) => h.content.match(/\[analysis: ([^\]]+)\]/)?.[1]).filter((x): x is string => !!x && x.split('|')[0] === assessment!.domain);
    const differing = earlier.filter((sig) => sig !== current);
    if (differing.length && !req.birthDetailsChanged) {
      sections.push(`## Consistency note\nAn earlier answer in this conversation was based on a different analysis of this question (${differing[differing.length - 1].split('|').slice(1, 3).join(', ')}); the chart and birth details have not changed. Follow the ESTABLISHED ANALYSIS above and, if the earlier answer said something different, state briefly that it is corrected.`);
    }
  }
  if (req.birthDetailsChanged) {
    // Deterministic comparison of the old and new charts so the answer can say exactly what changed (§17.5)
    let diff = '';
    const prev = req.birthDetailsChanged.previousBirthDetails;
    if (prev && analysis) {
      try {
        const prevChart = calculateNatalChart({ ...prev, name: 'native', now });
        const prevAnalysis = analyzeVedicChart(prevChart, { now });
        const prevAssessment = assessment ? assessDomain(prevChart, prevAnalysis, assessment.domain, now) : null;
        const changes = [
          `rising sign (Lagna): ${prevAnalysis.lagna?.sign ?? 'unknown'} → ${analysis.lagna?.sign ?? 'unknown'}`,
          `Moon sign: ${prevAnalysis.chandraLagna.sign} → ${analysis.chandraLagna.sign}`,
          ...(prevAssessment && assessment ? [`overall balance for this question: ${prevAssessment.balance} → ${assessment.balance}`, `confidence: ${prevAssessment.confidence} → ${assessment.confidence}`] : []),
        ];
        diff = `\nDeterministic comparison of the old and new charts: ${changes.join('; ')}. Tell the user plainly what changed (old → new) and which earlier conclusions no longer apply.`;
      } catch {
        diff = '';
      }
    }
    sections.push(`## Birth details were updated during this conversation\nEarlier answers used: ${req.birthDetailsChanged.previous}. The chart above uses: ${req.birthDetailsChanged.current}. Earlier conclusions that depended on the old data are superseded; explain what changed if it matters for this question.${diff}`);
  }
  sections.push(`## Retrieved classical passages (cite by id only if relevant; quote only verbatim)\n${passages.length ? JSON.stringify(passages.map((p) => ({ id: p.id, title: p.title, author: p.author, kind: p.sourceKind, chapter: p.chapter, pages: p.pages, excerpt: p.excerpt }))) : '(none found)'}`);
  sections.push(OUTPUT_CONTRACT);

  return {
    systemPrompt: sections.join('\n\n'),
    assessment,
    allowPrediction,
    now,
    history,
    question,
    route,
    analysis,
    passages,
    methodologySections: methodology.map((m) => `${m.docTitle} — ${m.section}`),
    chartError,
  };
}

// ─── Output validation ───

const UI_CATEGORIES = new Set(['career', 'relationship', 'finance', 'health', 'spiritual', 'timing', 'remedy', 'general', 'education', 'family', 'personality']);

/** Removes any accidental references to the service's internals from user-facing text (DOC prompt §10). */
export function scrubImplementationLeaks(text: string): string {
  return text
    .replace(/\b(vedic|hellenistic|western|chinese)\.[a-z_]+(\.[a-z_]+)+\b/g, '')
    .replace(/\b(JSON|RAG|LLM)\b/g, '')
    .replace(/\b(the )?(CALCULATED CHART( section)?|chart context|JSON payload|retrieved (classical )?passages?|knowledge base|vector database|system prompt|rule engine|calculation engine)\b/gi, (m) =>
      /passage|knowledge|vector/i.test(m) ? 'the classical texts' : /chart/i.test(m) ? 'your calculated chart' : 'the calculation')
    .replace(/\b(as an AI( model)?|as a language model|large language model|Gemini|OpenAI|ChatGPT|Qwen|OpenRouter|Anthropic)\b/gi, 'Vyom')
    .replace(/[ \t]{2,}/g, ' ');
}

/** Cache/consistency key components: methodology + assessment versions travel with every answer. */
export const PIPELINE_VERSION = `${METHODOLOGY_VERSION}/${ASSESSMENT_VERSION}`;

function scrubReading(r: StructuredReading): StructuredReading {
  const sc = (t?: string) => (t ? scrubImplementationLeaks(t) : t);
  return {
    ...r,
    directAnswer: { heading: sc(r.directAnswer.heading)!, text: sc(r.directAnswer.text)! },
    mainTakeaway: sc(r.mainTakeaway),
    keyFindings: r.keyFindings.map((f) => ({ ...f, title: sc(f.title)!, explanation: sc(f.explanation)!, inDailyLife: sc(f.inDailyLife), relevance: sc(f.relevance), qualification: sc(f.qualification) })),
    prediction: r.prediction ? { ...r.prediction, what: sc(r.prediction.what)!, why: sc(r.prediction.why), influences: sc(r.prediction.influences), meaning: sc(r.prediction.meaning) } : null,
    technicalEvidence: sc(r.technicalEvidence)!,
    uncertainties: r.uncertainties.map((u) => sc(u)!),
  };
}

/** Builds the validated reading from model output (null if the output is unusable). */
const contractContext = (prepared: PreparedConsultation): ContractContext =>
  ({ assessment: prepared.assessment, analysis: prepared.analysis, allowPrediction: prepared.allowPrediction, now: prepared.now, question: prepared.question });

export function readingFromOutput(parsed: unknown, prepared: PreparedConsultation): StructuredReading | null {
  const r = buildReading(parsed, contractContext(prepared));
  if (!r) return null;
  // A reading without a usable Summary gets the deterministic one, so the plain explanation is never missing
  if (!(parsed as any)?.summary && prepared.assessment) r.directAnswer.text = plainSummary(prepared.assessment);
  return scrubReading(r);
}

export function readingViolations(reading: StructuredReading, prepared: PreparedConsultation): ReadingViolation[] {
  return validateReading(reading, contractContext(prepared));
}

export function repairReading(reading: StructuredReading, violations: ReadingViolation[], prepared?: PreparedConsultation): StructuredReading {
  return removeViolations(reading, violations, plainSummary(prepared?.assessment ?? null));
}

/** Feedback appended to the request when a draft fails validation (one repair attempt). */
export function repairInstruction(violations: ReadingViolation[]): string {
  return `Your previous draft contradicted the calculated chart or broke the writing rules in these places:\n${violations.map((v) => `- "${v.sentence}" — ${v.detail}`).join('\n')}\nRewrite the complete JSON answer, fixing every item above and keeping everything else consistent with the ESTABLISHED ANALYSIS.`;
}

export function finalizeAnswer(parsed: any, prepared: PreparedConsultation, readingOverride?: StructuredReading | null): VisualAnswerResponse {
  const reading = readingOverride !== undefined ? readingOverride : (hasReadingOutput(parsed) ? readingFromOutput(parsed, prepared) : null);
  if (reading) {
    const cited = new Set<string>(Array.isArray(parsed?.cited_passage_ids) ? parsed.cited_passage_ids.map(String) : []);
    const sources: VisualAnswerBlock[] = prepared.passages.filter((x) => cited.has(x.id)).slice(0, 3).map((p) => ({
      type: 'source',
      title: p.title,
      author: p.author,
      chapter: [p.chapter, p.pages].filter(Boolean).join(' · '),
      excerpt: p.excerpt,
      relevance: p.sourceKind === 'western_esoteric' ? 'Western esoteric tradition (a belief system, not verified fact)' : p.sourceKind === 'classical_vedic_primary' ? 'Classical Jyotisha text' : 'Reference text',
    }));
    const domainCategory: Record<string, string> = { marriage: 'relationship', career: 'career', wealth: 'finance', education: 'education', family_children: 'family', health: 'health', relocation: 'general', spirituality: 'spiritual', personality: 'personality', transitions: 'timing' };
    const category = prepared.assessment ? domainCategory[prepared.assessment.domain] : UI_CATEGORIES.has(parsed?.category) ? parsed.category : 'general';
    const sig = reading.analysisSignature;
    return {
      summary: reading.directAnswer.text,
      category,
      reading,
      blocks: [{ type: 'markdown', content: readingToMarkdown(reading) + (sig ? `\n\n[analysis: ${sig}]` : '') }, ...sources],
      followUpQuestions: (Array.isArray(parsed?.follow_up_questions) ? parsed.follow_up_questions : [])
        .filter((f: unknown) => typeof f === 'string' && f.trim()).slice(0, 4).map((f: string) => scrubImplementationLeaks(f)),
      disclaimer: 'Traditional astrological interpretation for reflection — not a prediction of certain events and not a substitute for professional advice.',
    };
  }
  return legacyFinalize(parsed, prepared);
}

function legacyFinalize(parsed: any, prepared: PreparedConsultation): VisualAnswerResponse {
  const blocks: VisualAnswerBlock[] = [];
  for (const b of Array.isArray(parsed?.blocks) ? parsed.blocks : []) {
    if (b?.type === 'markdown' && typeof (b.content ?? b.text) === 'string') {
      blocks.push({ type: 'markdown', content: scrubImplementationLeaks(b.content ?? b.text) });
    } else if (b?.type === 'metric' && b.label && b.value !== undefined) {
      blocks.push({ type: 'metric', label: scrubImplementationLeaks(String(b.label)), value: String(b.value), explanation: b.explanation ? scrubImplementationLeaks(String(b.explanation)) : undefined });
    }
  }
  if (!blocks.length && typeof parsed?.answer === 'string') blocks.push({ type: 'markdown', content: scrubImplementationLeaks(parsed.answer) });

  // Source blocks are built only from passages that were actually retrieved, verbatim.
  const cited = new Set<string>(Array.isArray(parsed?.citedPassageIds) ? parsed.citedPassageIds.map(String) : []);
  for (const p of prepared.passages.filter((x) => cited.has(x.id)).slice(0, 3)) {
    blocks.push({
      type: 'source',
      title: p.title,
      author: p.author,
      chapter: [p.chapter, p.pages].filter(Boolean).join(' · '),
      excerpt: p.excerpt,
      relevance: p.sourceKind === 'western_esoteric' ? 'Western esoteric tradition (a belief system, not verified fact)' : p.sourceKind === 'classical_vedic_primary' ? 'Classical Jyotisha text' : 'Reference text',
    });
  }

  const category = UI_CATEGORIES.has(parsed?.category) ? parsed.category : 'general';
  const followUps = (Array.isArray(parsed?.followUpQuestions) ? parsed.followUpQuestions : [])
    .filter((f: unknown) => typeof f === 'string' && f.trim())
    .slice(0, 3)
    .map((f: string) => scrubImplementationLeaks(f));

  const settingsNote = prepared.analysis
    ? `Vedic sidereal chart · Lahiri ayanamsha · Whole Sign houses${prepared.analysis.workflow.timePrecision !== 'exact' ? ` · birth time ${prepared.analysis.workflow.timePrecision}` : ''}.`
    : '';
  const disclaimer = [typeof parsed?.disclaimer === 'string' ? scrubImplementationLeaks(parsed.disclaimer) : 'Traditional astrological interpretation, offered for reflection — not a substitute for professional advice.', settingsNote].filter(Boolean).join(' ');

  return {
    summary: scrubImplementationLeaks(typeof parsed?.summary === 'string' ? parsed.summary : ''),
    category,
    blocks,
    followUpQuestions: followUps,
    disclaimer,
  };
}
