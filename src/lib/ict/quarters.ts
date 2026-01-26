import { SessionQuarter, QuarterState, QuarterPhase, AMDPhase } from './types';
import { getNYTime } from '../utils';

// Session quarters (Q1-Q4 within each session)
export const SESSION_QUARTERS: SessionQuarter[] = [
  // Asia Session (20:00 - 00:00 NY)
  { session: 'asia', quarter: 'Q1', startHour: 20, startMinute: 0, endHour: 21, endMinute: 0 },
  { session: 'asia', quarter: 'Q2', startHour: 21, startMinute: 0, endHour: 22, endMinute: 0 },
  { session: 'asia', quarter: 'Q3', startHour: 22, startMinute: 0, endHour: 23, endMinute: 0 },
  { session: 'asia', quarter: 'Q4', startHour: 23, startMinute: 0, endHour: 0, endMinute: 0 },
  // London Session (02:00 - 05:00 NY for killzone)
  { session: 'london', quarter: 'Q1', startHour: 2, startMinute: 0, endHour: 2, endMinute: 45 },
  { session: 'london', quarter: 'Q2', startHour: 2, startMinute: 45, endHour: 3, endMinute: 30 },
  { session: 'london', quarter: 'Q3', startHour: 3, startMinute: 30, endHour: 4, endMinute: 15 },
  { session: 'london', quarter: 'Q4', startHour: 4, startMinute: 15, endHour: 5, endMinute: 0 },
  // NY AM Session (09:30 - 12:00 NY)
  { session: 'ny_am', quarter: 'Q1', startHour: 9, startMinute: 30, endHour: 10, endMinute: 7 },
  { session: 'ny_am', quarter: 'Q2', startHour: 10, startMinute: 7, endHour: 10, endMinute: 45 },
  { session: 'ny_am', quarter: 'Q3', startHour: 10, startMinute: 45, endHour: 11, endMinute: 22 },
  { session: 'ny_am', quarter: 'Q4', startHour: 11, startMinute: 22, endHour: 12, endMinute: 0 },
  // NY PM Session (13:30 - 16:00 NY)
  { session: 'ny_pm', quarter: 'Q1', startHour: 13, startMinute: 30, endHour: 14, endMinute: 7 },
  { session: 'ny_pm', quarter: 'Q2', startHour: 14, startMinute: 7, endHour: 14, endMinute: 45 },
  { session: 'ny_pm', quarter: 'Q3', startHour: 14, startMinute: 45, endHour: 15, endMinute: 22 },
  { session: 'ny_pm', quarter: 'Q4', startHour: 15, startMinute: 22, endHour: 16, endMinute: 0 },
];

// AMD phase mapping by quarter
const QUARTER_AMD: Record<QuarterPhase, AMDPhase> = {
  Q1: 'accumulation',
  Q2: 'manipulation',
  Q3: 'distribution',
  Q4: 'x',
};

// Micro AMD phases within each quarter (4 micros per quarter)
const MICRO_AMD: Record<1 | 2 | 3 | 4, AMDPhase> = {
  1: 'accumulation',
  2: 'manipulation',
  3: 'distribution',
  4: 'x',
};

export function getCurrentSessionQuarter(): SessionQuarter | null {
  const now = getNYTime();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentMinutes = hour * 60 + minute;

  for (const sq of SESSION_QUARTERS) {
    let startMinutes = sq.startHour * 60 + sq.startMinute;
    let endMinutes = sq.endHour * 60 + sq.endMinute;

    // Handle midnight wrap
    if (sq.endHour === 0) {
      endMinutes = 24 * 60;
    }

    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
      return sq;
    }
  }

  return null;
}

export function getQuarterState(): QuarterState | null {
  const sq = getCurrentSessionQuarter();
  if (!sq) return null;

  const now = getNYTime();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const startMinutes = sq.startHour * 60 + sq.startMinute;
  let endMinutes = sq.endHour * 60 + sq.endMinute;
  if (sq.endHour === 0) endMinutes = 24 * 60;

  const quarterDuration = endMinutes - startMinutes;
  const elapsed = currentMinutes - startMinutes;

  // Calculate micro (1-4) within the quarter
  // Each quarter divides into 4 micros
  const microDuration = quarterDuration / 4;
  const microIndex = Math.min(4, Math.floor(elapsed / microDuration) + 1) as 1 | 2 | 3 | 4;

  // Progress within current micro
  const microStart = (microIndex - 1) * microDuration;
  const microElapsed = elapsed - microStart;
  const progress = Math.min(100, Math.max(0, (microElapsed / microDuration) * 100));

  return {
    session: sq.session,
    quarter: sq.quarter,
    micro: microIndex,
    amdPhase: MICRO_AMD[microIndex],
    progress,
  };
}

export function getCurrentAMDPhase(): AMDPhase {
  const sq = getCurrentSessionQuarter();
  if (!sq) return 'x';
  return QUARTER_AMD[sq.quarter];
}

export function getSessionProgress(): number {
  const sq = getCurrentSessionQuarter();
  if (!sq) return 0;

  const now = getNYTime();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = sq.startHour * 60 + sq.startMinute;
  let endMinutes = sq.endHour * 60 + sq.endMinute;

  if (sq.endHour === 0) {
    endMinutes = 24 * 60;
  }

  const duration = endMinutes - startMinutes;
  const elapsed = currentMinutes - startMinutes;

  return Math.min(100, Math.max(0, (elapsed / duration) * 100));
}

export function getCurrentSessionName(): string {
  const sq = getCurrentSessionQuarter();
  if (!sq) return 'Off Hours';

  const names: Record<string, string> = {
    asia: 'Asia',
    london: 'London',
    ny_am: 'NY AM',
    ny_pm: 'NY PM',
  };

  return names[sq.session] || 'Unknown';
}

export function isInKillzone(): boolean {
  return getCurrentSessionQuarter() !== null;
}
