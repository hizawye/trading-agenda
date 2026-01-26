import { SessionStrategy } from './types';

export const SESSION_STRATEGIES: SessionStrategy[] = [
  {
    id: 'asia_range_london_manip_ny_reversal',
    name: 'Asia Range → London Manipulation → NY Reversal',
    phases: [
      { session: 'asia', action: 'range' },
      { session: 'london', action: 'manipulation' },
      { session: 'ny', action: 'reversal' },
    ],
    entryGuidance: 'Wait for NY open after London fake-out. Look for displacement opposite to London direction.',
  },
  {
    id: 'asia_expansion_london_consol_ny_continuation',
    name: 'Asia Expansion → London Consolidation → NY Continuation',
    phases: [
      { session: 'asia', action: 'expansion' },
      { session: 'london', action: 'consolidation' },
      { session: 'ny', action: 'expansion' },
    ],
    entryGuidance: 'Enter NY continuation aligned with Asia direction. Look for London range break.',
  },
  {
    id: 'asia_range_london_expansion_ny_consolidation',
    name: 'Asia Range → London Expansion → NY Consolidation',
    phases: [
      { session: 'asia', action: 'range' },
      { session: 'london', action: 'expansion' },
      { session: 'ny', action: 'consolidation' },
    ],
    entryGuidance: 'Trade London breakout of Asia range. NY may continue or reverse late session.',
  },
  {
    id: 'asia_manip_london_reversal_ny_expansion',
    name: 'Asia Manipulation → London Reversal → NY Expansion',
    phases: [
      { session: 'asia', action: 'manipulation' },
      { session: 'london', action: 'reversal' },
      { session: 'ny', action: 'expansion' },
    ],
    entryGuidance: 'Asia creates false move. London reverses. NY provides main distribution leg.',
  },
];

export function getStrategyById(id: string): SessionStrategy | undefined {
  return SESSION_STRATEGIES.find((s) => s.id === id);
}

export function getStrategiesBySessionAction(
  session: 'asia' | 'london' | 'ny',
  action: string
): SessionStrategy[] {
  return SESSION_STRATEGIES.filter((s) =>
    s.phases.some((p) => p.session === session && p.action === action)
  );
}
