export type Session = 'asia' | 'london' | 'ny_am' | 'ny_pm';

export type Killzone =
  | 'asia_kz'
  | 'london_kz'
  | 'ny_am_kz'
  | 'ny_lunch'
  | 'ny_pm_kz';

export interface TimeRange {
  startHour: number; // 0-23
  startMinute: number; // 0-59
  endHour: number; // 0-23
  endMinute: number; // 0-59
}

export type SetupType =
  | 'continuation'
  | 'reversal'
  | 'liquidity_sweep'
  | 'fvg_fill'
  | 'breakout'
  | 'other';

export type TradeOutcome = 'win' | 'loss' | 'breakeven' | 'pending';
export type TradeDirection = 'long' | 'short';

export type Confirmation =
  | 'smt'
  | 'mss'
  | 'bos'
  | 'fvg'
  | 'swing_sweep'
  | 'pd_array'
  | 'time_window';

export interface Trade {
  id: string;
  timestamp: number; // Unix timestamp
  session: Session;
  timeWindow: string; // DEPRECATED - kept for backward compat
  killzone?: Killzone; // NEW - preferred field
  setupType: SetupType;
  direction: TradeDirection;
  symbol: string;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  outcome: TradeOutcome;
  pnl?: number;
  riskReward?: number;
  images: string[];
  notes: string;
  confirmations: Confirmation[];
  createdAt: number;
  updatedAt: number;
}

export interface Alert {
  id: string;
  time: string; // HH:mm format
  label: string;
  description?: string;
  enabled: boolean;
  days: number[]; // 0 = Sunday, 1 = Monday, etc.
}

export type RuleCategory = 'timing' | 'entry' | 'reversal' | 'continuation' | 'risk';

export interface Rule {
  id: string;
  category: RuleCategory;
  rule: string;
  active: boolean;
  order: number;
}

export interface SessionInfo {
  id: Session;
  name: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  color: string;
}

export interface KillzoneInfo {
  id: Killzone;
  name: string;
  description: string;
  times: TimeRange;
  color: string;
  session: Session; // Parent session reference
}

export interface SessionConfig {
  id: Session;
  name: string;
  times: TimeRange;
  color: string;
}

export interface UserSettings {
  sessions: SessionConfig[];
  killzones: KillzoneInfo[];
  lastModified: number;
}
