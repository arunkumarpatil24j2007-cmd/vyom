import fs from 'fs';
import path from 'path';

/**
 * Knowledge access for consultations: the full book corpus (every extracted chunk of every book in
 * data/knowledge/curated_corpus.json) and the 10 Vyom process documents (methodology_corpus.json),
 * indexed with BM25. Retrieval is filtered by source kind so that, e.g., a novel is never presented
 * as astrological authority and Western occult texts only surface for occult questions.
 */

export type SourceKind =
  | 'classical_vedic_primary'
  | 'modern_vedic_pedagogy'
  | 'philosophical_commentary'
  | 'divination_compendium'
  | 'western_esoteric'
  | 'literary_fiction'
  | 'unclassified_custom';

export interface BookChunk {
  id: string;
  docId: string;
  docTitle: string;
  author: string;
  translator?: string;
  tradition?: string;
  sourceKind?: SourceKind;
  chapter: string;
  pageStart?: number;
  pageEnd?: number;
  content: string;
  /** Share of characters forming readable words; scanned pages with a garbage OCR layer score ~0. */
  textQuality?: number;
  tags: string[];
}

export interface MethodologyChunk {
  id: string;
  docId: string;
  docNumber: number;
  docTitle: string;
  section: string;
  content: string;
}

export interface RetrievedPassage {
  id: string;
  title: string;
  author: string;
  sourceKind: SourceKind;
  chapter: string;
  pages?: string;
  excerpt: string;
  score: number;
}

// Kinds fall back to the doc id when an older corpus file lacks the sourceKind field.
const KIND_BY_DOC: Record<string, SourceKind> = {
  'doc-bphs': 'classical_vedic_primary',
  'doc-brihat-jataka': 'classical_vedic_primary',
  'doc-phaladeepika': 'classical_vedic_primary',
  'doc-saravali': 'classical_vedic_primary',
  'doc-jataka-parijata': 'classical_vedic_primary',
  'doc-rao-lessons': 'modern_vedic_pedagogy',
  'doc-vasudev-origin': 'philosophical_commentary',
  'doc-compendium-divination': 'divination_compendium',
  'doc-levi-magic': 'western_esoteric',
  'doc-hartmann-magic': 'western_esoteric',
  'doc-bowen-blackmagic': 'literary_fiction',
};

// Default source hierarchy weights (prompt §6: primary tradition texts above general references).
const KIND_WEIGHT: Record<SourceKind, number> = {
  classical_vedic_primary: 1.25,
  modern_vedic_pedagogy: 1.1,
  divination_compendium: 1.0,
  philosophical_commentary: 0.85,
  western_esoteric: 0.9,
  unclassified_custom: 0.8,
  literary_fiction: 0.5,
};

const STOPWORDS = new Set(('a an and are as at be been but by can could did do does for from had has have how i if in into is it its me my of on or our should so than that the their them then there these they this to was we were what when where which who why will with would you your about am any been being just more most much no not now only other over same some such too very also may might shall upon unto thee thou thy hath doth said one two').split(' '));

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t))
    .map(stem);
}

/** Light suffix stemming so "planets"/"planet", "aspects"/"aspected" share a term. */
function stem(t: string): string {
  if (t.length > 5 && t.endsWith('ing')) return t.slice(0, -3);
  if (t.length > 4 && t.endsWith('ed')) return t.slice(0, -2);
  if (t.length > 4 && t.endsWith('es') && !t.endsWith('ses')) return t.slice(0, -2);
  if (t.length > 3 && t.endsWith('s') && !t.endsWith('ss')) return t.slice(0, -1);
  return t;
}

interface Bm25Index {
  docs: Array<{ len: number; tf: Map<string, number> }>;
  df: Map<string, number>;
  avgLen: number;
}

function buildIndex(texts: string[]): Bm25Index {
  const df = new Map<string, number>();
  const docs = texts.map((text) => {
    const tf = new Map<string, number>();
    const tokens = tokenize(text);
    for (const tok of tokens) tf.set(tok, (tf.get(tok) || 0) + 1);
    for (const tok of tf.keys()) df.set(tok, (df.get(tok) || 0) + 1);
    return { len: tokens.length, tf };
  });
  const avgLen = docs.reduce((s, d) => s + d.len, 0) / Math.max(1, docs.length);
  return { docs, df, avgLen };
}

function bm25Scores(index: Bm25Index, queryTerms: Map<string, number>): Float64Array {
  const k1 = 1.4;
  const b = 0.75;
  const n = index.docs.length;
  const scores = new Float64Array(n);
  for (const [term, qWeight] of queryTerms) {
    const df = index.df.get(term);
    if (!df) continue;
    const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
    for (let i = 0; i < n; i++) {
      const f = index.docs[i].tf.get(term);
      if (!f) continue;
      const d = index.docs[i];
      scores[i] += qWeight * idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / index.avgLen)));
    }
  }
  return scores;
}

interface LoadedCorpus<T> { items: T[]; index: Bm25Index; mtime: number }
let bookCache: LoadedCorpus<BookChunk> | null = null;
let methodologyCache: LoadedCorpus<MethodologyChunk> | null = null;

function knowledgePath(file: string): string {
  return path.resolve(process.cwd(), 'data/knowledge', file);
}

// Chunks below this text quality (unreadable OCR) are kept on disk but never retrieved.
export const MIN_TEXT_QUALITY = 0.35;

function load<T>(file: string, cache: LoadedCorpus<T> | null, textOf: (item: T) => string, keep: (item: T) => boolean = () => true): LoadedCorpus<T> | null {
  const p = knowledgePath(file);
  if (!fs.existsSync(p)) return null;
  const mtime = fs.statSync(p).mtimeMs;
  if (cache && cache.mtime === mtime) return cache;
  const items = (JSON.parse(fs.readFileSync(p, 'utf-8')) as T[]).filter(keep);
  return { items, index: buildIndex(items.map(textOf)), mtime };
}

export function getBookCorpus(): LoadedCorpus<BookChunk> | null {
  bookCache = load<BookChunk>(
    'curated_corpus.json',
    bookCache,
    (c) => `${c.docTitle} ${c.chapter} ${(c.tags || []).join(' ')} ${c.content}`,
    (c) => c.textQuality === undefined || c.textQuality >= MIN_TEXT_QUALITY
  );
  return bookCache;
}

export function getMethodologyCorpus(): LoadedCorpus<MethodologyChunk> | null {
  methodologyCache = load<MethodologyChunk>('methodology_corpus.json', methodologyCache, (c) => `${c.section} ${c.content}`);
  return methodologyCache;
}

export function kindOf(chunk: BookChunk): SourceKind {
  return chunk.sourceKind || KIND_BY_DOC[chunk.docId] || 'unclassified_custom';
}

function queryWeights(primary: string, expansions: string[]): Map<string, number> {
  const weights = new Map<string, number>();
  for (const t of tokenize(primary)) weights.set(t, (weights.get(t) || 0) + 1);
  for (const t of tokenize(expansions.join(' '))) weights.set(t, Math.max(weights.get(t) || 0, 0.6));
  return weights;
}

/** Cleans OCR page markers and whitespace and trims an excerpt to a sentence boundary. */
function excerptOf(content: string, terms: Map<string, number>, maxLen: number): string {
  const text = content.replace(/\[Page \d+\]\s*/g, '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLen) return text;
  // Centre the window on the densest cluster of query terms
  const lower = text.toLowerCase();
  let best = 0;
  let bestScore = -1;
  for (let start = 0; start < text.length - maxLen / 2; start += 120) {
    const window = lower.slice(start, start + maxLen);
    let score = 0;
    for (const term of terms.keys()) if (window.includes(term)) score += terms.get(term)!;
    if (score > bestScore) { bestScore = score; best = start; }
  }
  const sentenceStart = best === 0 ? 0 : Math.max(0, text.lastIndexOf('. ', best) + 2);
  const slice = text.slice(sentenceStart, sentenceStart + maxLen);
  const lastStop = slice.lastIndexOf('. ');
  return (sentenceStart > 0 ? '… ' : '') + (lastStop > maxLen * 0.6 ? slice.slice(0, lastStop + 1) : slice + ' …');
}

export interface BookQuery {
  text: string;
  expansions?: string[];
  allowKinds: SourceKind[];
  maxResults?: number;
  maxPerBook?: number;
  excerptChars?: number;
}

export function searchBooks(q: BookQuery): RetrievedPassage[] {
  const corpus = getBookCorpus();
  if (!corpus) return [];
  const weights = queryWeights(q.text, q.expansions || []);
  const scores = bm25Scores(corpus.index, weights);
  const ranked: Array<{ i: number; score: number }> = [];
  for (let i = 0; i < scores.length; i++) {
    if (scores[i] <= 0) continue;
    const kind = kindOf(corpus.items[i]);
    if (!q.allowKinds.includes(kind)) continue;
    ranked.push({ i, score: scores[i] * KIND_WEIGHT[kind] });
  }
  ranked.sort((a, b) => b.score - a.score);
  const perBook = new Map<string, number>();
  const out: RetrievedPassage[] = [];
  for (const { i, score } of ranked) {
    const c = corpus.items[i];
    if ((perBook.get(c.docId) || 0) >= (q.maxPerBook ?? 2)) continue;
    perBook.set(c.docId, (perBook.get(c.docId) || 0) + 1);
    out.push({
      id: c.id,
      title: c.docTitle,
      author: c.author,
      sourceKind: kindOf(c),
      chapter: c.chapter,
      pages: c.pageStart ? (c.pageEnd && c.pageEnd !== c.pageStart ? `pp. ${c.pageStart}–${c.pageEnd}` : `p. ${c.pageStart}`) : undefined,
      excerpt: excerptOf(c.content, weights, q.excerptChars ?? 700),
      score: Math.round(score * 100) / 100,
    });
    if (out.length >= (q.maxResults ?? 6)) break;
  }
  return out;
}

export function searchMethodology(text: string, maxResults = 4, preferDocs: number[] = []): Array<MethodologyChunk & { score: number }> {
  const corpus = getMethodologyCorpus();
  if (!corpus) return [];
  const scores = bm25Scores(corpus.index, queryWeights(text, []));
  return corpus.items
    .map((item, i) => ({ ...item, score: scores[i] * (preferDocs.includes(item.docNumber) ? 1.3 : 1) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

export function getManifestSummary(): Array<{ id: string; title: string; author: string; sourceKind: SourceKind; chunks: number }> {
  const corpus = getBookCorpus();
  if (!corpus) return [];
  const byDoc = new Map<string, { id: string; title: string; author: string; sourceKind: SourceKind; chunks: number }>();
  for (const c of corpus.items) {
    const e = byDoc.get(c.docId) || { id: c.docId, title: c.docTitle, author: c.author, sourceKind: kindOf(c), chunks: 0 };
    e.chunks++;
    byDoc.set(c.docId, e);
  }
  return [...byDoc.values()];
}
