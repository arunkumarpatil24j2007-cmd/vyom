import { calculateNatalChart } from '../calculations/chartEngine';
import { evaluateMangalDosha, evaluateKaalSarpDosha, evaluateSadeSati } from '../rules/evaluateDosha';
import type { UserBirthDetails } from '../../storage/guestStore';
import type { ChartData } from '@/types';
import type { VisualAnswerResponse } from '@/types/visualAnswer';

export interface AstrologyWorkflowInput {
  profile: UserBirthDetails;
  question: string;
  category?: 'career' | 'relationships' | 'finance' | 'health' | 'spiritual' | 'general';
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  /** Present when the saved birth details changed after earlier answers in this conversation. */
  birthDetailsChanged?: { previous: string; current: string; previousProfile?: UserBirthDetails } | null;
}

export interface AstrologyWorkflowResult {
  chart: ChartData;
  answer: VisualAnswerResponse;
  doshas: {
    mangalDosha: ReturnType<typeof evaluateMangalDosha>;
    kaalSarp: ReturnType<typeof evaluateKaalSarpDosha>;
    sadeSati: ReturnType<typeof evaluateSadeSati>;
  };
}

/** Human-readable one-line summary of birth details (used to note corrections mid-conversation). */
export function describeBirthDetails(p: UserBirthDetails): string {
  const time = p.birthTimePrecision === 'unknown' || !p.birthTime ? 'time unknown' : `${p.birthTime}${p.birthTimePrecision === 'approximate' ? ' (approximate)' : ''}`;
  return `${p.birthDate}, ${time}, ${p.birthPlace} (${p.timezone})`;
}

/** Birth details sent to the server (no name — DOCUMENT_10 rule 12). */
function birthDetailsPayload(p: UserBirthDetails) {
  return {
    birthDate: p.birthDate,
    birthTime: p.birthTimePrecision === 'unknown' ? '' : p.birthTime,
    birthTimePrecision: p.birthTimePrecision || 'exact',
    latitude: p.latitude,
    longitude: p.longitude,
    timezone: p.timezone,
  };
}

/**
 * Consultation orchestrator. The chart is calculated locally for the UI, while the server
 * recalculates it from the same birth details (the authoritative copy used for interpretation),
 * evaluates the documented rules, retrieves classical sources and generates the reading.
 * The user's name is not sent.
 */
export async function runAstrologyWorkflow(input: AstrologyWorkflowInput): Promise<AstrologyWorkflowResult> {
  const { profile, question, conversationHistory = [], birthDetailsChanged = null } = input;
  const birthTime = profile.birthTimePrecision === 'unknown' ? '' : profile.birthTime;

  const chart = calculateNatalChart({
    name: profile.name,
    birthDate: profile.birthDate,
    birthTime,
    birthTimePrecision: profile.birthTimePrecision,
    birthPlace: profile.birthPlace,
    latitude: profile.latitude,
    longitude: profile.longitude,
    timezone: profile.timezone,
  });

  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      conversationHistory,
      birthDetails: birthDetailsPayload(profile),
      birthDetailsChanged: birthDetailsChanged && {
        previous: birthDetailsChanged.previous,
        current: birthDetailsChanged.current,
        previousBirthDetails: birthDetailsChanged.previousProfile ? birthDetailsPayload(birthDetailsChanged.previousProfile) : undefined,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Consultation request failed with status ${response.status}`);
  }

  const answer = (await response.json()) as VisualAnswerResponse;
  if (!answer || !Array.isArray(answer.blocks)) {
    throw new Error('The consultation could not be completed right now. Please try asking again in a moment.');
  }

  return {
    chart,
    answer,
    doshas: {
      mangalDosha: evaluateMangalDosha(chart),
      kaalSarp: evaluateKaalSarpDosha(chart),
      sadeSati: evaluateSadeSati(chart),
    },
  };
}
