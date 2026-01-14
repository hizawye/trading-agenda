import { create } from 'zustand';
import { Rule, RuleCategory } from '../types';
import * as db from '../lib/database';
import { DEFAULT_RULES } from '../constants/defaultRules';
import { generateId } from '../lib/utils';

interface RuleState {
  rules: Rule[];
  loading: boolean;

  loadRules: () => Promise<void>;
  addRule: (rule: Omit<Rule, 'id'>) => Promise<Rule>;
  updateRule: (rule: Rule) => Promise<void>;
  toggleRule: (id: string) => Promise<void>;
  deleteRule: (id: string) => Promise<void>;
  seedDefaultRules: () => Promise<void>;
  getRulesByCategory: (category: RuleCategory) => Rule[];
}

export const useRuleStore = create<RuleState>((set, get) => ({
  rules: [],
  loading: false,

  loadRules: async () => {
    set({ loading: true });
    try {
      let rules = await db.getAllRules();

      // Seed defaults if empty
      if (rules.length === 0) {
        await get().seedDefaultRules();
        rules = await db.getAllRules();
      }

      set({ rules, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addRule: async (ruleData) => {
    const rule: Rule = {
      ...ruleData,
      id: generateId(),
    };
    await db.insertRule(rule);
    set((state) => ({ rules: [...state.rules, rule] }));
    return rule;
  },

  updateRule: async (rule) => {
    await db.updateRule(rule);
    set((state) => ({
      rules: state.rules.map((r) => (r.id === rule.id ? rule : r)),
    }));
  },

  toggleRule: async (id) => {
    const rule = get().rules.find((r) => r.id === id);
    if (rule) {
      const updated = { ...rule, active: !rule.active };
      await get().updateRule(updated);
    }
  },

  deleteRule: async (id) => {
    await db.deleteRule(id);
    set((state) => ({
      rules: state.rules.filter((r) => r.id !== id),
    }));
  },

  seedDefaultRules: async () => {
    for (const ruleData of DEFAULT_RULES) {
      const rule: Rule = { ...ruleData, id: generateId() };
      await db.insertRule(rule);
    }
  },

  getRulesByCategory: (category) => {
    return get()
      .rules.filter((r) => r.category === category)
      .sort((a, b) => a.order - b.order);
  },
}));
