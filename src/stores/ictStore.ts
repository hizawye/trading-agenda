import { create } from 'zustand';
import { DailyBias, CurrentMarketState, WeeklyTemplateId, TimeMacro, QuarterState } from '../types/ict';
import { getCurrentMarketState, getDayProfile, getCurrentMacro, getQuarterState } from '../lib/ictProfiles';
import { getWeekTemplate, setWeekTemplate as dbSetWeekTemplate, getWeekStartDate } from '../lib/database';

interface ICTState {
  bias: DailyBias;
  isDelayed: boolean;
  marketState: CurrentMarketState;
  activeTemplateId: WeeklyTemplateId | null;
  weekStartDate: string;
  activeMacro: TimeMacro | null;
  quarterState: QuarterState | null;

  setBias: (bias: DailyBias) => void;
  setDelayed: (isDelayed: boolean) => void;
  refreshMarketState: () => void;
  refreshMacroState: () => void;
  loadWeekTemplate: () => Promise<void>;
  setWeekTemplate: (templateId: WeeklyTemplateId) => Promise<void>;
}

export const useICTStore = create<ICTState>((set, get) => ({
  bias: 'neutral',
  isDelayed: false,
  marketState: getCurrentMarketState('neutral', false),
  activeTemplateId: null,
  weekStartDate: getWeekStartDate(),
  activeMacro: null,
  quarterState: null,

  setBias: (bias) => {
    set({ bias });
    get().refreshMarketState();
  },

  setDelayed: (isDelayed) => {
    set({ isDelayed });
    get().refreshMarketState();
  },

  refreshMarketState: () => {
    const { bias, isDelayed, activeTemplateId } = get();
    const baseState = getCurrentMarketState(bias, isDelayed, activeTemplateId || undefined);

    // Override day profile if template is active
    if (activeTemplateId) {
      const dayProfile = getDayProfile(baseState.dayOfWeek, activeTemplateId);
      set({
        marketState: { ...baseState, dayProfile },
        activeMacro: baseState.activeMacro,
        quarterState: baseState.quarterState,
      });
    } else {
      set({
        marketState: baseState,
        activeMacro: baseState.activeMacro,
        quarterState: baseState.quarterState,
      });
    }
  },

  refreshMacroState: () => {
    const activeMacro = getCurrentMacro();
    const quarterState = getQuarterState();
    set({ activeMacro, quarterState });
  },

  loadWeekTemplate: async () => {
    const weekStartDate = getWeekStartDate();
    const templateId = await getWeekTemplate(weekStartDate);
    set({ activeTemplateId: templateId as WeeklyTemplateId | null, weekStartDate });
    get().refreshMarketState();
  },

  setWeekTemplate: async (templateId: WeeklyTemplateId) => {
    const { weekStartDate } = get();
    await dbSetWeekTemplate(weekStartDate, templateId);
    set({ activeTemplateId: templateId });
    get().refreshMarketState();
  },
}));
