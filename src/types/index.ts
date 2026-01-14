export type Session = 'asia' | 'london' | 'ny_am' | 'ny_pm';

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
  timeWindow: string;
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
  endHour: number;
  color: string;
}
