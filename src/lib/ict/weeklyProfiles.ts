import { DayOfWeek, DayProfile, WeeklyTemplate, WeeklyTemplateId, WeeklyTemplateCategory } from './types';
import { getNYTime } from '../utils';

// Legacy weekly profiles (default)
export const WEEKLY_PROFILES: DayProfile[] = [
  {
    day: 'monday',
    expectedAction: 'range',
    description: 'Accumulation day. Range-bound, sets weekly bias. Look for Sunday gap fill.',
    amdPhase: 'accumulation',
  },
  {
    day: 'tuesday',
    expectedAction: 'reversal_down',
    description: 'Judas day. Expect false move opposite to weekly direction. Classic manipulation.',
    amdPhase: 'manipulation',
  },
  {
    day: 'wednesday',
    expectedAction: 'expansion_up',
    description: 'Expansion day. True weekly direction reveals. Strongest trending day.',
    amdPhase: 'distribution',
  },
  {
    day: 'thursday',
    expectedAction: 'expansion_up',
    description: 'Continuation or reversal. May continue Wed move or start reversal.',
    amdPhase: 'distribution',
  },
  {
    day: 'friday',
    expectedAction: 'reversal_up',
    description: 'Profit-taking day. Weekly high/low often made. Reduced size recommended.',
    amdPhase: 'x',
  },
];

// Expanded weekly templates (10 variants per blog research)
export const WEEKLY_TEMPLATES: Record<WeeklyTemplateId, WeeklyTemplate> = {
  classic_tuesday_low: {
    id: 'classic_tuesday_low',
    name: 'Classic Tuesday Low',
    description: 'Tuesday forms the weekly low, bullish expansion follows',
    useCase: 'Bullish weeks where Tuesday manipulation creates the low of week',
    category: 'classic',
    bias: 'bullish',
    profiles: [
      { day: 'monday', expectedAction: 'range', description: 'Accumulation, sets weekly range', amdPhase: 'accumulation' },
      { day: 'tuesday', expectedAction: 'reversal_up', description: 'Judas swing down, forms weekly low', amdPhase: 'manipulation' },
      { day: 'wednesday', expectedAction: 'expansion_up', description: 'True move up begins', amdPhase: 'distribution' },
      { day: 'thursday', expectedAction: 'expansion_up', description: 'Continuation higher', amdPhase: 'distribution' },
      { day: 'friday', expectedAction: 'range', description: 'Consolidation, reduced activity', amdPhase: 'x' },
    ],
  },
  classic_tuesday_high: {
    id: 'classic_tuesday_high',
    name: 'Classic Tuesday High',
    description: 'Tuesday forms the weekly high, bearish expansion follows',
    useCase: 'Bearish weeks where Tuesday manipulation creates the high of week',
    category: 'classic',
    bias: 'bearish',
    profiles: [
      { day: 'monday', expectedAction: 'range', description: 'Accumulation, sets weekly range', amdPhase: 'accumulation' },
      { day: 'tuesday', expectedAction: 'reversal_down', description: 'Judas swing up, forms weekly high', amdPhase: 'manipulation' },
      { day: 'wednesday', expectedAction: 'expansion_down', description: 'True move down begins', amdPhase: 'distribution' },
      { day: 'thursday', expectedAction: 'expansion_down', description: 'Continuation lower', amdPhase: 'distribution' },
      { day: 'friday', expectedAction: 'range', description: 'Consolidation, reduced activity', amdPhase: 'x' },
    ],
  },
  wednesday_low: {
    id: 'wednesday_low',
    name: 'Wednesday Low',
    description: 'Delayed manipulation, Wednesday forms weekly low',
    useCase: 'Mon-Tue accumulation, Wed manipulation creates low, Thu-Fri rally',
    category: 'wednesday',
    bias: 'bullish',
    profiles: [
      { day: 'monday', expectedAction: 'range', description: 'Accumulation begins', amdPhase: 'accumulation' },
      { day: 'tuesday', expectedAction: 'range', description: 'Accumulation continues', amdPhase: 'accumulation' },
      { day: 'wednesday', expectedAction: 'reversal_up', description: 'Manipulation down then reversal', amdPhase: 'manipulation' },
      { day: 'thursday', expectedAction: 'expansion_up', description: 'Distribution begins', amdPhase: 'distribution' },
      { day: 'friday', expectedAction: 'expansion_up', description: 'Distribution continues', amdPhase: 'distribution' },
    ],
  },
  wednesday_high: {
    id: 'wednesday_high',
    name: 'Wednesday High',
    description: 'Delayed manipulation, Wednesday forms weekly high',
    useCase: 'Mon-Tue accumulation, Wed manipulation creates high, Thu-Fri decline',
    category: 'wednesday',
    bias: 'bearish',
    profiles: [
      { day: 'monday', expectedAction: 'range', description: 'Accumulation begins', amdPhase: 'accumulation' },
      { day: 'tuesday', expectedAction: 'range', description: 'Accumulation continues', amdPhase: 'accumulation' },
      { day: 'wednesday', expectedAction: 'reversal_down', description: 'Manipulation up then reversal', amdPhase: 'manipulation' },
      { day: 'thursday', expectedAction: 'expansion_down', description: 'Distribution begins', amdPhase: 'distribution' },
      { day: 'friday', expectedAction: 'expansion_down', description: 'Distribution continues', amdPhase: 'distribution' },
    ],
  },
  wednesday_reversal_bull: {
    id: 'wednesday_reversal_bull',
    name: 'Wednesday Reversal Bull',
    description: 'Wed intraday reversal from manipulation to distribution',
    useCase: 'Wed provides manipulation then same-day reversal, bullish expansion',
    category: 'wednesday',
    bias: 'bullish',
    profiles: [
      { day: 'monday', expectedAction: 'range', description: 'Accumulation begins', amdPhase: 'accumulation' },
      { day: 'tuesday', expectedAction: 'range', description: 'Accumulation continues', amdPhase: 'accumulation' },
      { day: 'wednesday', expectedAction: 'seek_destroy', description: 'Manipulation then distribution up', amdPhase: 'manipulation' },
      { day: 'thursday', expectedAction: 'expansion_up', description: 'Distribution continues', amdPhase: 'distribution' },
      { day: 'friday', expectedAction: 'range', description: 'Profit-taking, reduced activity', amdPhase: 'x' },
    ],
  },
  wednesday_reversal_bear: {
    id: 'wednesday_reversal_bear',
    name: 'Wednesday Reversal Bear',
    description: 'Wed intraday reversal from manipulation to distribution',
    useCase: 'Wed provides manipulation then same-day reversal, bearish expansion',
    category: 'wednesday',
    bias: 'bearish',
    profiles: [
      { day: 'monday', expectedAction: 'range', description: 'Accumulation begins', amdPhase: 'accumulation' },
      { day: 'tuesday', expectedAction: 'range', description: 'Accumulation continues', amdPhase: 'accumulation' },
      { day: 'wednesday', expectedAction: 'seek_destroy', description: 'Manipulation then distribution down', amdPhase: 'manipulation' },
      { day: 'thursday', expectedAction: 'expansion_down', description: 'Distribution continues', amdPhase: 'distribution' },
      { day: 'friday', expectedAction: 'range', description: 'Profit-taking, reduced activity', amdPhase: 'x' },
    ],
  },
  consolidation_thursday_bull: {
    id: 'consolidation_thursday_bull',
    name: 'Consolidation Thursday Bull',
    description: 'Extended Mon-Wed range, Thursday breakout bullish',
    useCase: 'Compressed weeks with late breakout on Thursday, bullish',
    category: 'consolidation',
    bias: 'bullish',
    profiles: [
      { day: 'monday', expectedAction: 'range', description: 'Range building', amdPhase: 'accumulation' },
      { day: 'tuesday', expectedAction: 'range', description: 'Range continues', amdPhase: 'accumulation' },
      { day: 'wednesday', expectedAction: 'range', description: 'Final accumulation', amdPhase: 'accumulation' },
      { day: 'thursday', expectedAction: 'seek_destroy', description: 'Manipulation then breakout up', amdPhase: 'manipulation' },
      { day: 'friday', expectedAction: 'range', description: 'Reduced activity', amdPhase: 'x' },
    ],
  },
  consolidation_thursday_bear: {
    id: 'consolidation_thursday_bear',
    name: 'Consolidation Thursday Bear',
    description: 'Extended Mon-Wed range, Thursday breakout bearish',
    useCase: 'Compressed weeks with late breakout on Thursday, bearish',
    category: 'consolidation',
    bias: 'bearish',
    profiles: [
      { day: 'monday', expectedAction: 'range', description: 'Range building', amdPhase: 'accumulation' },
      { day: 'tuesday', expectedAction: 'range', description: 'Range continues', amdPhase: 'accumulation' },
      { day: 'wednesday', expectedAction: 'range', description: 'Final accumulation', amdPhase: 'accumulation' },
      { day: 'thursday', expectedAction: 'seek_destroy', description: 'Manipulation then breakout down', amdPhase: 'manipulation' },
      { day: 'friday', expectedAction: 'range', description: 'Reduced activity', amdPhase: 'x' },
    ],
  },
  seek_destroy_friday_bull: {
    id: 'seek_destroy_friday_bull',
    name: 'Seek & Destroy Friday Bull',
    description: 'Choppy week with extended manipulation, Friday bullish resolution',
    useCase: 'High manipulation weeks, avoid early entries, Friday rally',
    category: 'seek_destroy',
    bias: 'bullish',
    profiles: [
      { day: 'monday', expectedAction: 'range', description: 'Initial range set', amdPhase: 'accumulation' },
      { day: 'tuesday', expectedAction: 'seek_destroy', description: 'Both sides hunted', amdPhase: 'manipulation' },
      { day: 'wednesday', expectedAction: 'seek_destroy', description: 'Continued manipulation', amdPhase: 'manipulation' },
      { day: 'thursday', expectedAction: 'seek_destroy', description: 'More stop hunts', amdPhase: 'manipulation' },
      { day: 'friday', expectedAction: 'expansion_up', description: 'Finally resolves bullish', amdPhase: 'distribution' },
    ],
  },
  seek_destroy_friday_bear: {
    id: 'seek_destroy_friday_bear',
    name: 'Seek & Destroy Friday Bear',
    description: 'Choppy week with extended manipulation, Friday bearish resolution',
    useCase: 'High manipulation weeks, avoid early entries, Friday decline',
    category: 'seek_destroy',
    bias: 'bearish',
    profiles: [
      { day: 'monday', expectedAction: 'range', description: 'Initial range set', amdPhase: 'accumulation' },
      { day: 'tuesday', expectedAction: 'seek_destroy', description: 'Both sides hunted', amdPhase: 'manipulation' },
      { day: 'wednesday', expectedAction: 'seek_destroy', description: 'Continued manipulation', amdPhase: 'manipulation' },
      { day: 'thursday', expectedAction: 'seek_destroy', description: 'More stop hunts', amdPhase: 'manipulation' },
      { day: 'friday', expectedAction: 'expansion_down', description: 'Finally resolves bearish', amdPhase: 'distribution' },
    ],
  },
  monday_expansion_bull: {
    id: 'monday_expansion_bull',
    name: 'Monday Expansion Bull',
    description: 'Strong Monday sets bullish tone, week follows through',
    useCase: 'Gap up Monday with continuation, early week strength',
    category: 'monday_expansion',
    bias: 'bullish',
    profiles: [
      { day: 'monday', expectedAction: 'expansion_up', description: 'Strong bullish expansion sets tone', amdPhase: 'distribution' },
      { day: 'tuesday', expectedAction: 'range', description: 'Consolidation after Monday move', amdPhase: 'accumulation' },
      { day: 'wednesday', expectedAction: 'expansion_up', description: 'Continuation higher', amdPhase: 'distribution' },
      { day: 'thursday', expectedAction: 'range', description: 'Profit-taking, consolidation', amdPhase: 'x' },
      { day: 'friday', expectedAction: 'range', description: 'Reduced activity', amdPhase: 'x' },
    ],
  },
  monday_expansion_bear: {
    id: 'monday_expansion_bear',
    name: 'Monday Expansion Bear',
    description: 'Strong Monday sets bearish tone, week follows through',
    useCase: 'Gap down Monday with continuation, early week weakness',
    category: 'monday_expansion',
    bias: 'bearish',
    profiles: [
      { day: 'monday', expectedAction: 'expansion_down', description: 'Strong bearish expansion sets tone', amdPhase: 'distribution' },
      { day: 'tuesday', expectedAction: 'range', description: 'Consolidation after Monday move', amdPhase: 'accumulation' },
      { day: 'wednesday', expectedAction: 'expansion_down', description: 'Continuation lower', amdPhase: 'distribution' },
      { day: 'thursday', expectedAction: 'range', description: 'Profit-taking, consolidation', amdPhase: 'x' },
      { day: 'friday', expectedAction: 'range', description: 'Reduced activity', amdPhase: 'x' },
    ],
  },
  monday_gap_continuation_bull: {
    id: 'monday_gap_continuation_bull',
    name: 'Monday Gap Continuation Bull',
    description: 'Sunday gap up holds, Monday confirms bullish week',
    useCase: 'Weekend gap up with no fill, immediate bullish expansion',
    category: 'monday_expansion',
    bias: 'bullish',
    profiles: [
      { day: 'monday', expectedAction: 'expansion_up', description: 'Gap holds, expansion continues', amdPhase: 'distribution' },
      { day: 'tuesday', expectedAction: 'expansion_up', description: 'Strong follow-through', amdPhase: 'distribution' },
      { day: 'wednesday', expectedAction: 'reversal_down', description: 'Midweek pullback', amdPhase: 'manipulation' },
      { day: 'thursday', expectedAction: 'expansion_up', description: 'Resumption of trend', amdPhase: 'distribution' },
      { day: 'friday', expectedAction: 'range', description: 'Weekly high area', amdPhase: 'x' },
    ],
  },
  monday_gap_continuation_bear: {
    id: 'monday_gap_continuation_bear',
    name: 'Monday Gap Continuation Bear',
    description: 'Sunday gap down holds, Monday confirms bearish week',
    useCase: 'Weekend gap down with no fill, immediate bearish expansion',
    category: 'monday_expansion',
    bias: 'bearish',
    profiles: [
      { day: 'monday', expectedAction: 'expansion_down', description: 'Gap holds, expansion continues', amdPhase: 'distribution' },
      { day: 'tuesday', expectedAction: 'expansion_down', description: 'Strong follow-through', amdPhase: 'distribution' },
      { day: 'wednesday', expectedAction: 'reversal_up', description: 'Midweek pullback', amdPhase: 'manipulation' },
      { day: 'thursday', expectedAction: 'expansion_down', description: 'Resumption of trend', amdPhase: 'distribution' },
      { day: 'friday', expectedAction: 'range', description: 'Weekly low area', amdPhase: 'x' },
    ],
  },
};

// Template categories for UI grouping
export const TEMPLATE_CATEGORIES: Record<WeeklyTemplateCategory, { label: string; description: string }> = {
  monday_expansion: { label: 'Monday Exp', description: 'Monday expansion patterns' },
  classic: { label: 'Classic', description: 'Tuesday reversal patterns' },
  wednesday: { label: 'Wednesday', description: 'Delayed Wednesday patterns' },
  consolidation: { label: 'Consolidation', description: 'Extended range patterns' },
  seek_destroy: { label: 'Seek & Destroy', description: 'High manipulation patterns' },
};

export function getCurrentDayOfWeek(): DayOfWeek {
  const now = getNYTime();
  const dayIndex = now.getDay();
  const days: (DayOfWeek | null)[] = [null, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', null];
  return days[dayIndex] || 'monday';
}

export function getDayProfile(day?: DayOfWeek, templateId?: WeeklyTemplateId): DayProfile {
  const targetDay = day || getCurrentDayOfWeek();
  const profiles = templateId ? WEEKLY_TEMPLATES[templateId].profiles : WEEKLY_PROFILES;
  return profiles.find((p) => p.day === targetDay) || profiles[0];
}

export function getTemplatesByCategory(category: WeeklyTemplateCategory): WeeklyTemplate[] {
  return Object.values(WEEKLY_TEMPLATES).filter((t) => t.category === category);
}

export function getTemplatesByBias(bias: 'bullish' | 'bearish'): WeeklyTemplate[] {
  return Object.values(WEEKLY_TEMPLATES).filter((t) => t.bias === bias);
}
