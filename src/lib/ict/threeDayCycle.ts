import { CycleDay, CycleDayType, ThreeDayCycleState } from './types';
import { getNYTime } from '../utils';

// George Douglass Taylor's 3-Day Cycle
export const CYCLE_DAYS: Record<CycleDayType, CycleDay> = {
  buy: {
    day: 'buy',
    name: 'Buy Day (Day 1)',
    description: 'After 1-5 days of decline. Look for low in the morning, close in upper third of range.',
    expectedOpen: 'low',
    expectedClose: 'upper_third',
    action: 'Buy the morning low, hold for Day 2',
    color: '#10B981', // Green
  },
  sell: {
    day: 'sell',
    name: 'Sell Day (Day 2)',
    description: 'Usually rallies above Day 1. Cover longs, evaluate for continuation.',
    expectedOpen: 'mid',
    expectedClose: 'upper_third',
    action: 'Sell/cover longs on strength. Strong close = possible Day 3 continuation',
    color: '#F59E0B', // Amber
  },
  sell_short: {
    day: 'sell_short',
    name: 'Sell Short Day (Day 3)',
    description: 'High made in morning, close in lower third. End of up-cycle.',
    expectedOpen: 'high',
    expectedClose: 'lower_third',
    action: 'Sell short morning highs, expect decline into close',
    color: '#EF4444', // Red
  },
};

// Cycle patterns based on Taylor + Cameron Benson
export const CYCLE_PATTERNS = {
  standard: {
    id: 'standard',
    name: 'Standard 3-Day Cycle',
    description: 'Classic Buy → Sell → Sell Short pattern',
    sequence: ['buy', 'sell', 'sell_short'] as CycleDayType[],
  },
  extended_rally: {
    id: 'extended_rally',
    name: 'Extended Rally (4-8 Days)',
    description: 'Strong trend, larger structural pattern. Multiple Sell days before Sell Short.',
    sequence: ['buy', 'sell', 'sell', 'sell', 'sell_short'] as CycleDayType[],
  },
  failed_buy: {
    id: 'failed_buy',
    name: 'Failed Buy Day',
    description: 'Day 1 reverses, skip to Sell Short immediately',
    sequence: ['buy', 'sell_short'] as CycleDayType[],
  },
};

// Signal day patterns (Cameron Benson)
export const SIGNAL_DAYS = {
  inside_day: {
    id: 'inside_day',
    name: 'Inside Day',
    description: 'Range contained within prior day. Breakout expected next session.',
    implication: 'Continuation of prior trend direction on breakout',
  },
  outside_day: {
    id: 'outside_day',
    name: 'Outside Day',
    description: 'Range exceeds prior day both high and low.',
    implication: 'Reversal signal, close direction indicates next move',
  },
  narrow_range: {
    id: 'narrow_range',
    name: 'Narrow Range Day',
    description: 'Smallest range of last 4-7 days.',
    implication: 'Volatility expansion imminent',
  },
};

/**
 * Get current cycle day based on manual tracking or heuristics
 * Note: Accurate cycle tracking requires user input on cycle start
 */
export function getCycleDay(cycleStartDate: string): ThreeDayCycleState {
  const now = getNYTime();
  const start = new Date(cycleStartDate + 'T00:00:00');

  // Calculate trading days since cycle start
  let tradingDays = 0;
  const current = new Date(start);

  while (current < now) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      tradingDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  // Map to cycle day (1-indexed, wraps after 3)
  const dayInCycle = ((tradingDays - 1) % 3) + 1;
  const cycleMap: Record<number, CycleDayType> = {
    1: 'buy',
    2: 'sell',
    3: 'sell_short',
  };

  return {
    currentDay: cycleMap[dayInCycle],
    dayNumber: dayInCycle as 1 | 2 | 3,
    cycleStartDate,
    isExtended: tradingDays > 3,
  };
}

/**
 * Get cycle day info
 */
export function getCycleDayInfo(dayType: CycleDayType): CycleDay {
  return CYCLE_DAYS[dayType];
}

/**
 * Determine expected price behavior for current cycle day
 */
export function getCycleDayExpectation(dayType: CycleDayType): {
  morningBias: 'buy' | 'sell' | 'neutral';
  afternoonBias: 'buy' | 'sell' | 'neutral';
  keyLevel: 'morning_low' | 'morning_high' | 'midpoint';
} {
  switch (dayType) {
    case 'buy':
      return {
        morningBias: 'buy',
        afternoonBias: 'buy',
        keyLevel: 'morning_low',
      };
    case 'sell':
      return {
        morningBias: 'buy',
        afternoonBias: 'neutral',
        keyLevel: 'midpoint',
      };
    case 'sell_short':
      return {
        morningBias: 'sell',
        afternoonBias: 'sell',
        keyLevel: 'morning_high',
      };
  }
}
