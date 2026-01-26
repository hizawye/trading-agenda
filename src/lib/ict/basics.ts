import {
  AMDPhase,
  DayOfWeek,
  QuarterPhase,
} from './types';

// ============================================================================
// ICT BASICS - Comprehensive Reference
// Based on Michael J. Huddleston's Inner Circle Trader methodology
// Sources: time-price-research-astrofin.blogspot.com
// ============================================================================

// ----------------------------------------------------------------------------
// CORE CONCEPTS
// ----------------------------------------------------------------------------

export interface ICTConcept {
  id: string;
  name: string;
  description: string;
  category: ConceptCategory;
  relatedConcepts?: string[];
}

export type ConceptCategory =
  | 'market_structure'
  | 'liquidity'
  | 'order_flow'
  | 'time_theory'
  | 'entry_models'
  | 'price_arrays';

export const ICT_CORE_CONCEPTS: ICTConcept[] = [
  // Market Structure
  {
    id: 'market_structure',
    name: 'Market Structure',
    description: 'The pattern of higher highs/lows (bullish) or lower highs/lows (bearish) that defines trend direction.',
    category: 'market_structure',
    relatedConcepts: ['mss', 'bos'],
  },
  {
    id: 'mss',
    name: 'Market Structure Shift (MSS)',
    description: 'A change in the prevailing market structure indicating potential trend reversal. Occurs when price breaks a key swing point.',
    category: 'market_structure',
    relatedConcepts: ['market_structure', 'choch'],
  },
  {
    id: 'bos',
    name: 'Break of Structure (BOS)',
    description: 'Confirmation of trend continuation when price breaks the most recent swing high (bullish) or low (bearish).',
    category: 'market_structure',
  },
  {
    id: 'choch',
    name: 'Change of Character (CHoCH)',
    description: 'First sign of potential reversal - a break against the current trend direction.',
    category: 'market_structure',
    relatedConcepts: ['mss'],
  },

  // Liquidity Concepts
  {
    id: 'liquidity',
    name: 'Liquidity',
    description: 'Resting orders (stop losses, pending orders) at key levels that smart money targets. Price is drawn to liquidity.',
    category: 'liquidity',
    relatedConcepts: ['bsl', 'ssl', 'dol'],
  },
  {
    id: 'bsl',
    name: 'Buy Side Liquidity (BSL)',
    description: 'Stop losses above swing highs from short sellers. Smart money drives price up to trigger these stops.',
    category: 'liquidity',
  },
  {
    id: 'ssl',
    name: 'Sell Side Liquidity (SSL)',
    description: 'Stop losses below swing lows from long traders. Smart money drives price down to trigger these stops.',
    category: 'liquidity',
  },
  {
    id: 'dol',
    name: 'Draw on Liquidity (DOL)',
    description: 'The target liquidity pool that price is likely moving toward. Identifies where price wants to go.',
    category: 'liquidity',
    relatedConcepts: ['liquidity', 'bsl', 'ssl'],
  },
  {
    id: 'stop_hunt',
    name: 'Stop Hunt / Stop Run',
    description: 'Deliberate move by smart money to trigger retail stop losses before reversing.',
    category: 'liquidity',
    relatedConcepts: ['liquidity', 'judas_swing'],
  },
  {
    id: 'lrlr',
    name: 'Low Resistance Liquidity Run',
    description: 'When price has little resistance in its way to run an area of liquidity. Fast, directional moves.',
    category: 'liquidity',
  },

  // Order Flow & Price Arrays
  {
    id: 'order_block',
    name: 'Order Block (OB)',
    description: 'The last up/down candle before a significant move. Represents institutional order placement.',
    category: 'order_flow',
    relatedConcepts: ['breaker', 'mitigation'],
  },
  {
    id: 'breaker',
    name: 'Breaker Block',
    description: 'A failed order block that gets violated. Bearish OB broken becomes bullish breaker and vice versa.',
    category: 'order_flow',
    relatedConcepts: ['order_block'],
  },
  {
    id: 'mitigation',
    name: 'Mitigation Block',
    description: 'An order block that failed and price returns to mitigate (close out) the losing positions.',
    category: 'order_flow',
  },
  {
    id: 'rejection_block',
    name: 'Rejection Block',
    description: 'Price high/low formed with long wicks. Indicates strong rejection. Turtle Soup setup is an example.',
    category: 'order_flow',
  },
  {
    id: 'fvg',
    name: 'Fair Value Gap (FVG)',
    description: 'Imbalance in price where a 3-candle pattern leaves a gap. Price tends to return to fill these gaps.',
    category: 'price_arrays',
    relatedConcepts: ['liquidity_void'],
  },
  {
    id: 'liquidity_void',
    name: 'Liquidity Void',
    description: 'Large gap in price with no trading activity. Often created by news events. Price may return to fill.',
    category: 'price_arrays',
  },
  {
    id: 'vacuum_block',
    name: 'Vacuum Block',
    description: 'Gap created in price action as a result of a volatility event.',
    category: 'price_arrays',
  },

  // Premium/Discount
  {
    id: 'equilibrium',
    name: 'Equilibrium',
    description: 'The 50% level of a range. Divides premium from discount zones.',
    category: 'price_arrays',
    relatedConcepts: ['premium', 'discount'],
  },
  {
    id: 'premium',
    name: 'Premium Zone',
    description: 'Above the 50% (equilibrium) level. Expensive area - look for shorts.',
    category: 'price_arrays',
  },
  {
    id: 'discount',
    name: 'Discount Zone',
    description: 'Below the 50% (equilibrium) level. Cheap area - look for longs.',
    category: 'price_arrays',
  },

  // Time Theory
  {
    id: 'power_of_3',
    name: 'Power of 3 (AMD)',
    description: 'Accumulation → Manipulation → Distribution. The three phases of every market cycle.',
    category: 'time_theory',
    relatedConcepts: ['accumulation', 'manipulation', 'distribution'],
  },
  {
    id: 'quarterly_theory',
    name: 'Quarterly Theory',
    description: 'Time divided into quarters (Q1-Q4). Each quarter has characteristic price behavior aligned with AMD.',
    category: 'time_theory',
  },
  {
    id: 'ipda',
    name: 'IPDA (Inter-Bank Price Delivery Algorithm)',
    description: 'The algorithm that governs institutional price delivery. Targets liquidity zones systematically.',
    category: 'time_theory',
  },
  {
    id: 'killzones',
    name: 'Kill Zones',
    description: 'High-probability trading windows: London Open (02:00-05:00), NY Open (09:30-12:00), NY PM (13:30-16:00).',
    category: 'time_theory',
  },

  // Entry Models
  {
    id: 'ote',
    name: 'Optimal Trade Entry (OTE)',
    description: 'Entry at 62-79% Fibonacci retracement level. Best risk/reward entry point after displacement.',
    category: 'entry_models',
  },
  {
    id: 'silver_bullet',
    name: 'Silver Bullet',
    description: 'Specific setup window 10:00-11:00 AM NY time. Look for FVG entries during this macro.',
    category: 'entry_models',
  },
  {
    id: 'judas_swing',
    name: 'Judas Swing',
    description: 'False move (manipulation) opposite to the true intended direction. Traps retail traders.',
    category: 'entry_models',
    relatedConcepts: ['manipulation', 'stop_hunt'],
  },
  {
    id: 'turtle_soup',
    name: 'Turtle Soup',
    description: 'Fading a breakout of a prior high/low. Entry after liquidity sweep with quick reversal.',
    category: 'entry_models',
  },
  {
    id: 'unicorn',
    name: 'ICT Unicorn Setup',
    description: 'Breaker block with FVG overlap. High-probability entry when both align.',
    category: 'entry_models',
    relatedConcepts: ['breaker', 'fvg'],
  },
  {
    id: 'osok',
    name: 'One Shot One Kill (OSOK)',
    description: 'High-conviction trade using Power of 3, day of week, Fibonacci targets, and kill zones.',
    category: 'entry_models',
  },
];

// ----------------------------------------------------------------------------
// PD ARRAYS (Premium/Discount Arrays) - Hierarchy of Importance
// ----------------------------------------------------------------------------

export interface PDArray {
  id: string;
  name: string;
  description: string;
  priority: number; // 1 = highest
  forBullish: boolean;
  forBearish: boolean;
}

export const PD_ARRAYS: PDArray[] = [
  { id: 'mitigation', name: 'Mitigation Block', description: 'Failed OB being mitigated', priority: 1, forBullish: true, forBearish: true },
  { id: 'breaker', name: 'Breaker Block', description: 'Failed OB now acting as support/resistance', priority: 2, forBullish: true, forBearish: true },
  { id: 'liquidity_void', name: 'Liquidity Void', description: 'Gap from volatility event', priority: 3, forBullish: true, forBearish: true },
  { id: 'fvg', name: 'Fair Value Gap', description: 'Imbalance in price delivery', priority: 4, forBullish: true, forBearish: true },
  { id: 'order_block', name: 'Order Block', description: 'Last opposing candle before move', priority: 5, forBullish: true, forBearish: true },
  { id: 'rejection_block', name: 'Rejection Block', description: 'Wick rejection zone', priority: 6, forBullish: true, forBearish: true },
  { id: 'old_high_low', name: 'Old High/Low', description: 'Previous swing points', priority: 7, forBullish: true, forBearish: true },
];

// ----------------------------------------------------------------------------
// TRADING TIMEFRAMES
// ----------------------------------------------------------------------------

export interface TradingStyle {
  id: string;
  name: string;
  duration: string;
  timeframes: string[];
  description: string;
}

export const TRADING_STYLES: TradingStyle[] = [
  {
    id: 'position',
    name: 'Position Trading',
    duration: 'Weeks to months',
    timeframes: ['Monthly', 'Weekly'],
    description: 'Big picture macro analysis. Interest rates, seasonal patterns, COT data.',
  },
  {
    id: 'swing',
    name: 'Swing Trading',
    duration: '2 weeks or longer',
    timeframes: ['Weekly', 'Daily'],
    description: 'Intermediate-term trending markets. Rule-based methods with HTF bias.',
  },
  {
    id: 'short_term',
    name: 'Short Term Trading',
    duration: 'Days to 1 week',
    timeframes: ['Daily', 'H4', 'H1'],
    description: 'H1 execution with daily bias. Focus on weekly range profiles.',
  },
  {
    id: 'day_trading',
    name: 'Day Trading',
    duration: 'Single day',
    timeframes: ['H1', 'M15', 'M5'],
    description: 'Capture intraday movement. IPDA data ranges + PD arrays. Avoid FOMC/NFP.',
  },
  {
    id: 'scalping',
    name: 'Scalping',
    duration: '1-2 hours or less',
    timeframes: ['M5', 'M1'],
    description: 'Micro setups in kill zones. Target 15-30 pips. High volatility windows only.',
  },
];

// ----------------------------------------------------------------------------
// DAILY RANGE STRUCTURE
// ----------------------------------------------------------------------------

export interface SessionRange {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description: string;
  tradeable: boolean;
}

export const DAILY_SESSIONS: SessionRange[] = [
  { id: 'asia', name: 'Asian Range', startTime: '20:00', endTime: '00:00', description: 'Sets daily range boundaries. Low volatility accumulation.', tradeable: false },
  { id: 'cbdr', name: 'Central Bank Dealers Range', startTime: '14:00', endTime: '20:00', description: 'Used for projecting daily highs/lows. Ideal range < 40 pips.', tradeable: false },
  { id: 'london', name: 'London Kill Zone', startTime: '02:00', endTime: '05:00', description: 'First major liquidity sweep. Often forms daily high or low.', tradeable: true },
  { id: 'ny_am', name: 'NY AM Kill Zone', startTime: '09:30', endTime: '12:00', description: 'Primary trading session. Highest probability setups.', tradeable: true },
  { id: 'lunch', name: 'NY Lunch', startTime: '12:00', endTime: '13:30', description: 'Avoid trading. Low volume, choppy, manipulation.', tradeable: false },
  { id: 'ny_pm', name: 'NY PM Kill Zone', startTime: '13:30', endTime: '16:00', description: 'Secondary session. Reversals or continuations.', tradeable: true },
  { id: 'london_close', name: 'London Close', startTime: '10:00', endTime: '12:00', description: 'London fix at 11:00. Can see reversals.', tradeable: true },
];

// ----------------------------------------------------------------------------
// INTRADAY TEMPLATES (Michael J. Huddleston)
// ----------------------------------------------------------------------------

export interface IntradayTemplate {
  id: string;
  name: string;
  type: 'trend' | 'typical' | 'neutral';
  amSession: string;
  pmSession: string;
  description: string;
}

export const INTRADAY_TEMPLATES: IntradayTemplate[] = [
  {
    id: 'trend_up',
    name: 'Two Session Up Close',
    type: 'trend',
    amSession: 'Rally',
    pmSession: 'Rally continues',
    description: 'Trend day bullish. Both sessions close higher. Strong IOF.',
  },
  {
    id: 'trend_down',
    name: 'Two Session Down Close',
    type: 'trend',
    amSession: 'Decline',
    pmSession: 'Decline continues',
    description: 'Trend day bearish. Both sessions close lower. Strong IOF.',
  },
  {
    id: 'typical_reversal_up',
    name: 'AM Decline PM Reversal',
    type: 'typical',
    amSession: 'Decline (manipulation)',
    pmSession: 'Reversal up (distribution)',
    description: 'Typical day. AM sweep of lows, PM rallies. Classic AMD.',
  },
  {
    id: 'typical_reversal_down',
    name: 'AM Rally PM Reversal',
    type: 'typical',
    amSession: 'Rally (manipulation)',
    pmSession: 'Reversal down (distribution)',
    description: 'Typical day. AM sweep of highs, PM sells off. Classic AMD.',
  },
  {
    id: 'neutral_up',
    name: 'Consolidation AM Rally PM Decline',
    type: 'neutral',
    amSession: 'Consolidation → Late rally',
    pmSession: 'Decline into close',
    description: 'Neutral day. Range-bound AM, late AM rally fails in PM.',
  },
  {
    id: 'neutral_down',
    name: 'Consolidation AM Decline PM Rally',
    type: 'neutral',
    amSession: 'Consolidation → Late decline',
    pmSession: 'Rally into close',
    description: 'Neutral day. Range-bound AM, late AM decline reverses in PM.',
  },
];

// ----------------------------------------------------------------------------
// SETUPS & STRATEGIES
// ----------------------------------------------------------------------------

export interface ICTSetup {
  id: string;
  name: string;
  timeWindow: string;
  description: string;
  steps: string[];
  fibTargets?: string[];
}

export const ICT_SETUPS: ICTSetup[] = [
  {
    id: 'ote',
    name: 'Optimal Trade Entry (OTE)',
    timeWindow: '08:30-11:00 AM NY',
    description: 'Entry at 62-79% retracement after displacement. Core ICT entry model.',
    steps: [
      'Identify HTF bias and DOL',
      'Wait for displacement (BOS/MSS)',
      'Mark the FVG or OB from displacement',
      'Apply Fibonacci from swing low to high (or vice versa)',
      'Enter at 62% retracement (OTE zone)',
      'Stop below/above swing point',
      'Target -1 to -2 Fibonacci extension',
    ],
    fibTargets: ['62% entry', '-1 (1:1)', '-1.5', '-2 (full extension)'],
  },
  {
    id: 'silver_bullet',
    name: 'Silver Bullet',
    timeWindow: '10:00-11:00 AM NY',
    description: 'High-probability FVG entry during the Silver Bullet macro window.',
    steps: [
      'Determine daily bias from HTF',
      'Wait for 10:00 AM NY',
      'Look for FVG formation in bias direction',
      'Enter on return to FVG',
      'Target next liquidity pool',
    ],
  },
  {
    id: 'tgif',
    name: 'TGIF (Thank God It\'s Friday)',
    timeWindow: 'Friday, late session',
    description: 'Friday retracement into weekly range. Expect pullback toward weekly 50%.',
    steps: [
      'Mark weekly high and low (Mon-Thu)',
      'Calculate 50% of weekly range',
      'On Friday, expect price to retrace toward this level',
      'Use Power of 3 and Silver Bullet for entry',
      'Reduced position size - end of week',
    ],
  },
  {
    id: 'am_setup',
    name: 'AM NY Session A+ Setup',
    timeWindow: '08:15-08:38 AM NY (Q3 micro)',
    description: 'Based on Power of 3 and Quarterly Theory. Look for Unicorn setup.',
    steps: [
      'Analyze HTF for bias',
      'Wait for Q3 micro cycle (08:15-08:38)',
      'Look for ICT Unicorn (breaker + FVG overlap)',
      'Enter with tight stop',
      'Target AM session high/low',
    ],
  },
  {
    id: 'osok',
    name: 'One Shot One Kill (OSOK)',
    timeWindow: 'Kill zone aligned with weekly template',
    description: 'High-conviction trade combining multiple ICT concepts.',
    steps: [
      'Identify day of week context (weekly template)',
      'Confirm Power of 3 phase',
      'Use Fibonacci for OTE entry',
      'Execute in kill zone only',
      'Target weekly DOL',
    ],
  },
];

// ----------------------------------------------------------------------------
// FIBONACCI LEVELS
// ----------------------------------------------------------------------------

export const ICT_FIB_LEVELS = {
  // Retracement (entry zones)
  retracement: {
    shallow: 0.5,      // 50% - equilibrium
    ote: 0.62,         // 62% - optimal trade entry
    deep: 0.705,       // 70.5%
    extreme: 0.79,     // 79% - last chance entry
  },
  // Extension (targets)
  extension: {
    equal: -1,         // 1:1 move
    standard: -1.5,    // 1.5x move
    full: -2,          // 2x move
    extended: -2.5,    // 2.5x move
  },
};

// ----------------------------------------------------------------------------
// RISK MANAGEMENT
// ----------------------------------------------------------------------------

export const ICT_RISK_RULES = {
  maxRiskPerTrade: 0.25,  // 0.25% per trade (ICT recommendation)
  conservativeRisk: 0.5,  // 0.5% for higher conviction
  maxDailyRisk: 1,        // 1% max daily drawdown
  targetRR: 3,            // Minimum 3:1 reward/risk
  scalping: {
    targetPips: 20,       // 15-30 pips average
    maxDuration: '2h',    // 1-2 hours max
  },
};

// ----------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------

export function getConceptsByCategory(category: ConceptCategory): ICTConcept[] {
  return ICT_CORE_CONCEPTS.filter(c => c.category === category);
}

export function getConceptById(id: string): ICTConcept | undefined {
  return ICT_CORE_CONCEPTS.find(c => c.id === id);
}

export function getRelatedConcepts(conceptId: string): ICTConcept[] {
  const concept = getConceptById(conceptId);
  if (!concept?.relatedConcepts) return [];
  return concept.relatedConcepts
    .map(id => getConceptById(id))
    .filter((c): c is ICTConcept => c !== undefined);
}

export function getSetupById(id: string): ICTSetup | undefined {
  return ICT_SETUPS.find(s => s.id === id);
}

export function getPDArraysByPriority(): PDArray[] {
  return [...PD_ARRAYS].sort((a, b) => a.priority - b.priority);
}

export function getTradeableSessionsNow(): SessionRange[] {
  // Would need getNYTime() integration for real implementation
  return DAILY_SESSIONS.filter(s => s.tradeable);
}
