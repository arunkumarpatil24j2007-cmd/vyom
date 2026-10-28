/**
 * Vyom Knowledge Ingestion Pipeline
 * Safe, explicit document ingestion architecture for authorized user astrology books,
 * shastras, commentaries, and manuscripts.
 */

export interface IngestedDocument {
  id: string;
  filename: string;
  title: string;
  author?: string;
  sourceType: 'classical_shastra' | 'commentary' | 'ephemeris_table' | 'research_paper' | 'user_manuscript';
  mimeType: string;
  fileSizeBytes: number;
  contentHash: string;
  ingestedAt: string;
  chunkCount: number;
  status: 'pending' | 'parsing' | 'chunked' | 'indexed' | 'failed';
  errorMessage?: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  chapter?: string;
  section?: string;
  pageNumber?: number;
  content: string;
  tokenCount: number;
  embeddingId?: string;
}

const INGESTED_DOCS_KEY = 'vyom_ingested_documents';
const INGESTED_CHUNKS_KEY = 'vyom_ingested_chunks';

/**
 * Calculates a SHA-256 hash from text content for deduplication
 */
export async function computeContentHash(content: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return `hash-${content.length}-${content.slice(0, 16)}`;
}

/**
 * Splits plain text/markdown into structured semantic chunks with chapter/paragraph boundaries
 */
export function chunkTextDocument(
  text: string,
  options: { chunkSize?: number; chunkOverlap?: number; defaultChapter?: string } = {}
): Array<{ content: string; chapter?: string; section?: string }> {
  const { chunkSize = 800, chunkOverlap = 150, defaultChapter = 'General Discourse' } = options;
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: Array<{ content: string; chapter?: string; section?: string }> = [];

  let currentChunk = '';
  let currentChapter = defaultChapter;
  let currentSection = '';

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // Detect chapter / section headers
    if (/^(Chapter|Adhyaya|Section|Book|Part|Cantos)\s+\d+/i.test(trimmed) || /^#+\s+/.test(trimmed)) {
      if (currentChunk.trim().length > 0) {
        chunks.push({ content: currentChunk.trim(), chapter: currentChapter, section: currentSection });
        currentChunk = '';
      }
      currentChapter = trimmed.replace(/^#+\s*/, '');
      continue;
    }

    if (currentChunk.length + trimmed.length > chunkSize) {
      if (currentChunk.trim().length > 0) {
        chunks.push({ content: currentChunk.trim(), chapter: currentChapter, section: currentSection });
        // Preserve overlap
        currentChunk = currentChunk.slice(-chunkOverlap) + '\n\n' + trimmed;
      } else {
        chunks.push({ content: trimmed, chapter: currentChapter, section: currentSection });
        currentChunk = '';
      }
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmed;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({ content: currentChunk.trim(), chapter: currentChapter, section: currentSection });
  }

  return chunks;
}

export function getIngestedDocuments(): IngestedDocument[] {
  try {
    const raw = localStorage.getItem(INGESTED_DOCS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveIngestedDocument(doc: IngestedDocument, chunks: DocumentChunk[]): void {
  try {
    const docs = getIngestedDocuments();
    const existingIdx = docs.findIndex((d) => d.id === doc.id || d.contentHash === doc.contentHash);
    if (existingIdx >= 0) {
      docs[existingIdx] = doc;
    } else {
      docs.unshift(doc);
    }
    localStorage.setItem(INGESTED_DOCS_KEY, JSON.stringify(docs));

    // Save chunks
    const rawChunks = localStorage.getItem(INGESTED_CHUNKS_KEY);
    const existingChunks: DocumentChunk[] = rawChunks ? JSON.parse(rawChunks) : [];
    const filteredChunks = existingChunks.filter((c) => c.documentId !== doc.id);
    filteredChunks.push(...chunks);
    localStorage.setItem(INGESTED_CHUNKS_KEY, JSON.stringify(filteredChunks));
  } catch (e) {
    console.error('Failed to save ingested document:', e);
  }
}

export function deleteIngestedDocument(documentId: string): void {
  try {
    const docs = getIngestedDocuments().filter((d) => d.id !== documentId);
    localStorage.setItem(INGESTED_DOCS_KEY, JSON.stringify(docs));

    const rawChunks = localStorage.getItem(INGESTED_CHUNKS_KEY);
    if (rawChunks) {
      const chunks: DocumentChunk[] = JSON.parse(rawChunks);
      const filtered = chunks.filter((c) => c.documentId !== documentId);
      localStorage.setItem(INGESTED_CHUNKS_KEY, JSON.stringify(filtered));
    }
  } catch (e) {
    console.error('Failed to delete ingested document:', e);
  }
}
