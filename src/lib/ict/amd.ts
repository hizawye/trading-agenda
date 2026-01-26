import { AMDPhase, AMDPhaseInfo, DailyBias, ProfileType } from './types';

export const AMD_PHASES: Record<AMDPhase, AMDPhaseInfo> = {
  accumulation: {
    phase: 'accumulation',
    name: 'Accumulation',
    description: 'Smart money building positions, low volatility range',
    color: '#3B82F6', // Blue
  },
  manipulation: {
    phase: 'manipulation',
    name: 'Manipulation',
    description: 'Judas swing to trap retail, liquidity hunt',
    color: '#F59E0B', // Amber
  },
  distribution: {
    phase: 'distribution',
    name: 'Distribution',
    description: 'Smart money distributing, expansion move',
    color: '#10B981', // Green
  },
  x: {
    phase: 'x',
    name: 'Reversal/Continuation',
    description: 'Late session reversal or trend continuation',
    color: '#8B5CF6', // Purple
  },
};

export function getIntradayProfile(bias: DailyBias, isDelayed: boolean): ProfileType | null {
  if (bias === 'neutral') return null;

  if (bias === 'bullish') {
    return isDelayed ? 'delayed_buy' : 'normal_buy';
  } else {
    return isDelayed ? 'delayed_sell' : 'normal_sell';
  }
}

export function getAMDPhaseInfo(phase: AMDPhase): AMDPhaseInfo {
  return AMD_PHASES[phase];
}
