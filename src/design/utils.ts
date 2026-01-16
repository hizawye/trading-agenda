import { colors } from './tokens';
import type { TradeOutcome, TradeDirection } from '../types';

export const pnlColor = (value: number): string =>
  value >= 0 ? colors.semantic.success : colors.semantic.error;

export const winRateColor = (rate: number): string =>
  rate >= 50 ? colors.semantic.success : colors.semantic.error;

export const outcomeColor = (outcome: TradeOutcome): string => {
  switch (outcome) {
    case 'win':
      return colors.semantic.success;
    case 'loss':
      return colors.semantic.error;
    case 'breakeven':
      return colors.semantic.warning;
    default:
      return colors.text.tertiary;
  }
};

export const directionColor = (direction: TradeDirection): string =>
  direction === 'long' ? colors.semantic.success : colors.semantic.error;

export const sessionColor = (sessionId: string): string => {
  switch (sessionId) {
    case 'asia':
      return colors.trading.asia;
    case 'london':
      return colors.trading.london;
    case 'ny_am':
      return colors.trading.nyAm;
    case 'ny_pm':
      return colors.trading.nyPm;
    default:
      return colors.text.tertiary;
  }
};
