import { CLASSICAL_CORPUS, type ClassicalChunk } from '../corpus/classicalTexts';

export interface SearchKnowledgeOptions {
  category?: ClassicalChunk['category'];
  tags?: string[];
  maxResults?: number;
  minScore?: number;
}

export interface ScoredChunk {
  chunk: ClassicalChunk;
  score: number;
  matchReasons: string[];
}

export interface RetrievedContext {
  chunks: ClassicalChunk[];
  formattedContext: string;
  sourceCitations: Array<{
    title: string;
    author: string;
    chapter: string;
    shloka?: string;
    excerpt: string;
  }>;
}

/**
 * Searches the classical Jyotish knowledge base using multi-factor tokenization,
 * tag weighting, and category matching.
 */
export function searchKnowledge(query: string, options: SearchKnowledgeOptions = {}): ScoredChunk[] {
  const { category, tags = [], maxResults = 4, minScore = 0.1 } = options;
  const rawTerms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const queryTerms = Array.from(new Set(rawTerms));
  const results: ScoredChunk[] = [];

  for (const chunk of CLASSICAL_CORPUS) {
    if (category && chunk.category !== category) continue;

    let score = 0;
    const matchReasons: string[] = [];

    // 1. Tag matches (weight 3.0)
    for (const tag of chunk.tags) {
      for (const term of queryTerms) {
        if (tag.toLowerCase() === term) {
          score += 3.0;
          matchReasons.push(`Tag exact: ${tag}`);
        } else if (tag.toLowerCase().includes(term) || term.includes(tag.toLowerCase())) {
          score += 1.5;
          matchReasons.push(`Tag partial: ${tag}`);
        }
      }
      for (const filterTag of tags) {
        if (tag.toLowerCase() === filterTag.toLowerCase()) {
          score += 2.5;
          matchReasons.push(`Filter tag match: ${tag}`);
        }
      }
    }

    // 2. Section and title matches (weight 2.0)
    const headerText = `${chunk.section} ${chunk.chapter}`.toLowerCase();
    for (const term of queryTerms) {
      if (headerText.includes(term)) {
        score += 2.0;
        matchReasons.push(`Header match: ${term}`);
      }
    }

    // 3. Translation and commentary token hits (weight 0.5)
    const bodyText = `${chunk.translation} ${chunk.commentary}`.toLowerCase();
    for (const term of queryTerms) {
      if (bodyText.includes(term)) {
        score += 0.6;
      }
    }

    if (score >= minScore) {
      results.push({
        chunk,
        score,
        matchReasons,
      });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}

/**
 * Builds a prompt-ready context string and citations for AI orchestration.
 */
export function buildKnowledgeContext(
  query: string,
  chartContext?: {
    lagnaSignName?: string;
    moonSignName?: string;
    activeMahadasha?: string;
    doshas?: string[];
  }
): RetrievedContext {
  const options: SearchKnowledgeOptions = { maxResults: 3 };

  // Expand search tags based on chart conditions if present
  const tags: string[] = [];
  if (chartContext?.activeMahadasha) {
    tags.push(chartContext.activeMahadasha.toLowerCase(), 'dasha');
  }
  if (chartContext?.doshas && chartContext.doshas.length > 0) {
    tags.push(...chartContext.doshas.map((d) => d.toLowerCase()));
  }
  options.tags = tags;

  const scored = searchKnowledge(query, options);

  // If no specific hits, provide high-level foundational context
  const chunks = scored.length > 0 ? scored.map((s) => s.chunk) : CLASSICAL_CORPUS.slice(0, 2);

  const formattedContext = chunks
    .map(
      (c, i) =>
        `[Source ${i + 1}]: "${c.sourceTitle}" by ${c.author} (${c.chapter}, ${c.shlokaRef || 'Verses'})\n` +
        `Sanskrit: ${c.sanskritExcerpt || 'N/A'}\n` +
        `Principle: ${c.translation}\n` +
        `Application: ${c.commentary}`
    )
    .join('\n\n---\n\n');

  const sourceCitations = chunks.map((c) => ({
    title: c.sourceTitle,
    author: c.author,
    chapter: `${c.chapter} (${c.shlokaRef || ''})`,
    shloka: c.sanskritExcerpt,
    excerpt: c.translation,
  }));

  return {
    chunks,
    formattedContext,
    sourceCitations,
  };
}
