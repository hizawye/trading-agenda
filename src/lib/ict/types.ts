// ICT Time-Price Theory Types

export type QuarterPhase = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export type AMDPhase = 'accumulation' | 'manipulation' | 'distribution' | 'x';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export type ProfileType = 'normal_buy' | 'delayed_buy' | 'normal_sell' | 'delayed_sell';

export type ExpectedAction =
  | 'range'
  | 'expansion_up'
  | 'expansion_down'
  | 'reversal_up'
  | 'reversal_down'
  | 'seek_destroy';

export type DailyBias = 'bullish' | 'bearish' | 'neutral';

export interface QuarterInfo {
  phase: QuarterPhase;
  name: string;
  description: string;
  startHour: number;
  endHour: number;
}

export interface AMDPhaseInfo {
  phase: AMDPhase;
  name: string;
  description: string;
  color: string;
}

export interface DayProfile {
  day: DayOfWeek;
  expectedAction: ExpectedAction;
  description: string;
  amdPhase: AMDPhase;
}

export interface SessionQuarter {
  session: 'asia' | 'london' | 'ny_am' | 'ny_pm';
  quarter: QuarterPhase;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface IntradayProfile {
  type: ProfileType;
  name: string;
  description: string;
  entryWindow: string;
  characteristics: string[];
}

export interface CurrentMarketState {
  session: string;
  sessionQuarter: QuarterPhase;
  amdPhase: AMDPhase;
  dayOfWeek: DayOfWeek;
  dayProfile: DayProfile;
  intradayProfile: ProfileType | null;
  nextKeyTime: { label: string; time: string; hoursAway: number; minutesAway: number } | null;
  // NEW: Macro and quarter state
  activeMacro: TimeMacro | null;
  quarterState: QuarterState | null;
}

// Weekly Template Types (expanded to 14)
export type WeeklyTemplateId =
  | 'classic_tuesday_low'
  | 'classic_tuesday_high'
  | 'wednesday_low'
  | 'wednesday_high'
  | 'wednesday_reversal_bull'
  | 'wednesday_reversal_bear'
  | 'consolidation_thursday_bull'
  | 'consolidation_thursday_bear'
  | 'seek_destroy_friday_bull'
  | 'seek_destroy_friday_bear'
  | 'monday_expansion_bull'
  | 'monday_expansion_bear'
  | 'monday_gap_continuation_bull'
  | 'monday_gap_continuation_bear';

export type WeeklyTemplateCategory = 'classic' | 'wednesday' | 'consolidation' | 'seek_destroy' | 'monday_expansion';

export interface WeeklyTemplate {
  id: WeeklyTemplateId;
  name: string;
  description: string;
  useCase: string;
  category: WeeklyTemplateCategory;
  bias: 'bullish' | 'bearish';
  profiles: DayProfile[];
}

// Time Macros
export type MacroCategory = 'manipulation' | 'expansion' | 'accumulation';
export type MacroSession = 'london' | 'ny_am' | 'ny_pm';

export interface TimeMacro {
  id: string;
  name: string;
  startTime: string; // "HH:MM" format
  endTime: string;
  session: MacroSession;
  category: MacroCategory;
  description: string;
}

// Quarterly Theory subdivisions
export type QuarterLevel = 'session' | 'quarter' | 'micro';

export interface QuarterNode {
  level: QuarterLevel;
  index: number; // 1-4
  startMinutes: number;
  endMinutes: number;
  amdPhase: AMDPhase;
}

export interface QuarterState {
  session: 'asia' | 'london' | 'ny_am' | 'ny_pm';
  quarter: QuarterPhase;
  micro: 1 | 2 | 3 | 4;
  amdPhase: AMDPhase;
  progress: number; // 0-100 within current micro
}

// Session Strategies
export type SessionAction = 'range' | 'manipulation' | 'expansion' | 'consolidation' | 'reversal';

export interface SessionStrategyPhase {
  session: 'asia' | 'london' | 'ny';
  action: SessionAction;
}

export interface SessionStrategy {
  id: string;
  name: string;
  phases: SessionStrategyPhase[];
  entryGuidance: string;
}

// Taylor 3-Day Cycle
export type CycleDayType = 'buy' | 'sell' | 'sell_short';

export interface CycleDay {
  day: CycleDayType;
  name: string;
  description: string;
  expectedOpen: 'low' | 'high' | 'mid';
  expectedClose: 'upper_third' | 'lower_third' | 'mid';
  action: string;
  color: string;
}

export interface ThreeDayCycleState {
  currentDay: CycleDayType;
  dayNumber: 1 | 2 | 3;
  cycleStartDate: string;
  isExtended: boolean; // Rally extended beyond 3 days
}
