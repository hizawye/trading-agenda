import { Rule, RuleCategory } from '../types';

// Trading rules from notes organized by category
export const DEFAULT_RULES: Omit<Rule, 'id'>[] = [
  // TIMING RULES
  {
    category: 'timing',
    rule: 'Position yourself just before liquidity injection times (2:30am, 7:15am, 13:45)',
    active: true,
    order: 1,
  },
  {
    category: 'timing',
    rule: '4am and 10am are great liquidity injection times',
    active: true,
    order: 2,
  },
  {
    category: 'timing',
    rule: '5-5:30am often forms HOD/LOD',
    active: true,
    order: 3,
  },
  {
    category: 'timing',
    rule: 'No trading 8am-9am (gym time)',
    active: true,
    order: 4,
  },
  {
    category: 'timing',
    rule: '10-11am is a good trading window',
    active: true,
    order: 5,
  },
  {
    category: 'timing',
    rule: 'Look for setups at start and end of sessions',
    active: true,
    order: 6,
  },
  {
    category: 'timing',
    rule: 'The only window is between sessions',
    active: true,
    order: 7,
  },

  // CONTINUATION RULES
  {
    category: 'continuation',
    rule: 'Price is more likely to continue than reverse',
    active: true,
    order: 1,
  },
  {
    category: 'continuation',
    rule: 'Price continues yesterday\'s push if it was great',
    active: true,
    order: 2,
  },
  {
    category: 'continuation',
    rule: 'From 00:00 to 2am - trade continuation model (1h, 15m, 1m)',
    active: true,
    order: 3,
  },
  {
    category: 'continuation',
    rule: 'What 5-5:30am manipulates, 7:30am continues',
    active: true,
    order: 4,
  },
  {
    category: 'continuation',
    rule: 'When liquidity comes at 3pm, it just continues',
    active: true,
    order: 5,
  },
  {
    category: 'continuation',
    rule: 'Monday is a continuation day',
    active: true,
    order: 6,
  },

  // REVERSAL RULES
  {
    category: 'reversal',
    rule: 'Price only reverses if it took great liquidity (sweep swing or fill great FVG)',
    active: true,
    order: 1,
  },
  {
    category: 'reversal',
    rule: 'For reversals: wait for MSS, BOS, change in state of delivery',
    active: true,
    order: 2,
  },
  {
    category: 'reversal',
    rule: 'After 2am then I can look for reversals',
    active: true,
    order: 3,
  },
  {
    category: 'reversal',
    rule: '12pm is a reversal zone',
    active: true,
    order: 4,
  },
  {
    category: 'reversal',
    rule: 'To go higher: wait for external low sweep then internal low sweep',
    active: true,
    order: 5,
  },
  {
    category: 'reversal',
    rule: 'To go lower: wait for external high sweep then internal high sweep',
    active: true,
    order: 6,
  },

  // ENTRY RULES
  {
    category: 'entry',
    rule: 'SMT and 1h/15m swings are first priority confirmations',
    active: true,
    order: 1,
  },
  {
    category: 'entry',
    rule: 'Only enter at session starts/ends toward opposite liquidity',
    active: true,
    order: 2,
  },
  {
    category: 'entry',
    rule: 'Check DOL, mid range, and SMT before entry',
    active: true,
    order: 3,
  },
  {
    category: 'entry',
    rule: '4h candle: if it didn\'t hit DOL, next one sweeps and retraces 50%+',
    active: true,
    order: 4,
  },
  {
    category: 'entry',
    rule: 'Middle of ranges works sometimes',
    active: true,
    order: 5,
  },

  // RISK RULES
  {
    category: 'risk',
    rule: 'Respect the time windows',
    active: true,
    order: 1,
  },
];

export const RULE_CATEGORIES: { id: RuleCategory; label: string; color: string }[] = [
  { id: 'timing', label: 'Timing', color: '#3B82F6' },
  { id: 'continuation', label: 'Continuation', color: '#10B981' },
  { id: 'reversal', label: 'Reversal', color: '#EF4444' },
  { id: 'entry', label: 'Entry', color: '#8B5CF6' },
  { id: 'risk', label: 'Risk', color: '#F59E0B' },
];
