// ICT Module - Barrel Export
// Re-exports all ICT-related types, constants, and functions

// Types
export * from './types';

// Time Macros
export { TIME_MACROS, getCurrentMacro, getNextMacro, getMacroProgress } from './timeMacros';

// Quarters
export {
  SESSION_QUARTERS,
  getCurrentSessionQuarter,
  getQuarterState,
  getCurrentAMDPhase,
  getSessionProgress,
  getCurrentSessionName,
  isInKillzone,
} from './quarters';

// Weekly Profiles
export {
  WEEKLY_PROFILES,
  WEEKLY_TEMPLATES,
  TEMPLATE_CATEGORIES,
  getCurrentDayOfWeek,
  getDayProfile,
  getTemplatesByCategory,
  getTemplatesByBias,
} from './weeklyProfiles';

// Session Strategies
export { SESSION_STRATEGIES, getStrategyById, getStrategiesBySessionAction } from './sessionStrategies';

// AMD Phases
export { AMD_PHASES, getIntradayProfile, getAMDPhaseInfo } from './amd';

// Market State
export { KEY_TIMES, getNextKeyTime, getCurrentMarketState, formatTimeDisplay } from './marketState';

// Intraday Profiles
export { INTRADAY_PROFILES } from './intradayProfiles';

// Taylor 3-Day Cycle
export {
  CYCLE_DAYS,
  CYCLE_PATTERNS,
  SIGNAL_DAYS,
  getCycleDay,
  getCycleDayInfo,
  getCycleDayExpectation,
} from './threeDayCycle';

// ICT Basics Reference
export {
  ICT_CORE_CONCEPTS,
  PD_ARRAYS,
  TRADING_STYLES,
  DAILY_SESSIONS,
  INTRADAY_TEMPLATES,
  ICT_SETUPS,
  ICT_FIB_LEVELS,
  ICT_RISK_RULES,
  getConceptsByCategory,
  getConceptById,
  getRelatedConcepts,
  getSetupById,
  getPDArraysByPriority,
  getTradeableSessionsNow,
  type ConceptCategory,
} from './basics';
