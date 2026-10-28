/**
 * Vyom Typed Visual Answer Protocol
 * Governs the structured rendering of rich, multi-modal astrological consultations
 * ensuring zero ungrounded arbitrary HTML script execution.
 */

export type VisualAnswerBlock =
  | {
      type: 'markdown';
      content: string;
    }
  | {
      type: 'metric';
      label: string;
      value: string | number;
      explanation?: string;
      trend?: 'positive' | 'negative' | 'neutral';
    }
  | {
      type: 'chart';
      chartType: 'line' | 'bar' | 'pie' | 'radar';
      title: string;
      data: Array<Record<string, unknown>>;
      config?: {
        xKey?: string;
        yKeys?: string[];
        colors?: string[];
      };
    }
  | {
      type: 'timeline';
      title: string;
      events: Array<{
        label: string;
        description?: string;
        date?: string;
        category?: string;
        status?: 'current' | 'past' | 'future';
      }>;
    }
  | {
      type: 'table';
      title?: string;
      columns: string[];
      rows: Array<Record<string, unknown>>;
    }
  | {
      type: 'astrology_chart';
      chartType: 'north_indian' | 'south_indian';
      title?: string;
      ascendantSign: number; // 1-12
      houses: Array<{
        houseNumber: number;
        signNumber: number;
        planets: string[];
      }>;
      notes?: string;
    }
  | {
      type: 'source';
      title: string;
      author?: string;
      chapter?: string;
      shloka?: string;
      excerpt: string;
      relevance?: string;
    }
  | {
      type: 'illustration';
      assetId: string;
      alt: string;
      caption?: string;
      category?: 'planet' | 'deity' | 'ritual' | 'yantra' | 'gemstone';
    };

export interface VisualAnswerResponse {
  summary: string;
  category?: string;
  blocks: VisualAnswerBlock[];
  followUpQuestions?: string[];
  disclaimer?: string;
  traceId?: string;
  /** Answer-first structured reading; when present the UI renders it instead of the generic blocks. */
  reading?: StructuredReading;
}

// ─── Structured reading (answer-first contract) ───
// Produced by the server from the deterministic assessment plus the model's plain-language writing.
// Roles, confidence and timing windows always come from the assessment, never from the model.

export type ReadingFactorRole = 'supporting' | 'challenging' | 'mitigating' | 'mixed' | 'information';
export type ReadingConfidence = 'well_supported' | 'tentative' | 'not_assessable';

export interface ReadingFinding {
  title: string;
  explanation: string;
  /** What the finding could look like in ordinary life (an illustration, not a prediction). */
  inDailyLife?: string;
  relevance?: string;
  qualification?: string;
  role: ReadingFactorRole;
  evidence: string[];
}

export interface ReadingTimelineEntry {
  start: string;
  end: string;
  period: string;
  theme: string;
  strength: 'stronger' | 'supporting';
  why: string[];
  limitations: string[];
  isCurrent: boolean;
}

export interface ReadingPrediction {
  what: string;
  why?: string;
  influences?: string;
  meaning?: string;
  timing: ReadingTimelineEntry[];
  timingNote: string;
}

export interface ReadingFactor {
  plain: string;
  technical: string;
}

export interface StructuredReading {
  /** `text` is the plain-language Summary: 3–5 everyday sentences with no astrological terms. */
  directAnswer: { heading: string; text: string };
  mainTakeaway?: string;
  /** null for general/educational questions that are not judgements about a chart. */
  confidence: ReadingConfidence | null;
  confidenceLabel: string;
  confidenceReasons: string[];
  domainLabel?: string;
  keyFindings: ReadingFinding[];
  prediction: ReadingPrediction | null;
  supportingFactors: ReadingFactor[];
  challengingFactors: ReadingFactor[];
  mitigatingFactors: ReadingFactor[];
  technicalEvidence: string;
  calculationNotes: string[];
  uncertainties: string[];
  missingInformation: string[];
  /** Compact signature of the established analysis, echoed in conversation history for consistency checks. */
  analysisSignature?: string;
}
