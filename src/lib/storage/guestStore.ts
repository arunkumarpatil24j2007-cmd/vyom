import type { BirthProfile, ChartData, SavedReport } from '@/types';

export interface UserBirthDetails {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm ('' when unknown)
  birthTimePrecision?: 'exact' | 'approximate' | 'unknown';
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  gender?: 'male' | 'female' | 'other';
  createdAt: string;
  updatedAt: string;
}

// Simple event listener for reactivity
type StoreListener = () => void;
const listeners = new Set<StoreListener>();

function notify() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Store listener error:', e);
    }
  });
}

export function subscribeToGuestStore(listener: StoreListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// ══════════════════════════════════════════════════════════════════════════
// Ephemeral in-memory store:
// Per open-source privacy directive: Every time the user refreshes or closes/reopens,
// ALL user data is erased. No personal astrological data persists in localStorage.
// ══════════════════════════════════════════════════════════════════════════
let inMemoryProfile: UserBirthDetails | null = null;
let inMemoryCharts: ChartData[] = [];
let inMemoryReports: SavedReport[] = [];

// Clean up any historical localStorage keys so old sessions never leak
try {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('vyom_user_birth_profile');
    localStorage.removeItem('vyom_user_charts');
    localStorage.removeItem('vyom_user_reports');
    localStorage.removeItem('vyom_guest_session_id');
  }
} catch {
  // ignore
}

/**
 * Retrieves or generates an anonymous, transient session ID
 */
export function getGuestSessionId(): string {
  return `sess-${Date.now()}`;
}

/**
 * Returns the currently active in-memory user profile (null on refresh or new session)
 */
export function getActiveProfile(): UserBirthDetails | null {
  return inMemoryProfile;
}

/**
 * Saves or updates the user's birth profile in memory for the active runtime
 */
export function saveActiveProfile(details: Omit<UserBirthDetails, 'id' | 'createdAt' | 'updatedAt'>): UserBirthDetails {
  const now = new Date().toISOString();
  const profile: UserBirthDetails = {
    ...details,
    id: inMemoryProfile?.id || `usr-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: inMemoryProfile?.createdAt || now,
    updatedAt: now,
  };

  inMemoryProfile = profile;
  notify();
  return profile;
}

/**
 * Saves a calculated natal chart in memory for the current session
 */
export function saveCalculatedChart(chart: ChartData): void {
  const index = inMemoryCharts.findIndex((c) => c.id === chart.id);
  if (index >= 0) {
    inMemoryCharts[index] = chart;
  } else {
    inMemoryCharts.unshift(chart);
  }
  notify();
}

export function getSavedCharts(): ChartData[] {
  return inMemoryCharts;
}

/**
 * Saves an astrology consultation report in memory
 */
export function saveGeneratedReport(report: SavedReport): void {
  inMemoryReports.unshift(report);
  notify();
}

export function getSavedReports(): SavedReport[] {
  return inMemoryReports;
}

export function deleteSavedReport(id: string): void {
  inMemoryReports = inMemoryReports.filter((r) => r.id !== id);
  notify();
}

/**
 * Explicit Privacy Wipe: clears all in-memory birth details, charts, and reports
 */
export function clearAllGuestData(): void {
  inMemoryProfile = null;
  inMemoryCharts = [];
  inMemoryReports = [];
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vyom_user_birth_profile');
      localStorage.removeItem('vyom_user_charts');
      localStorage.removeItem('vyom_user_reports');
      localStorage.removeItem('vyom_guest_session_id');
    }
  } catch {
    // ignore
  }
  notify();
}
