import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings, SessionConfig, KillzoneInfo, Session, Killzone, TimeRange } from '../types';
import { SESSIONS } from '../constants/sessions';
import { DEFAULT_KILLZONES } from '../constants/killzones';
import logger from '../lib/logger';

const STORAGE_KEY = 'user-settings';

// Convert SESSIONS to SessionConfig format
const getDefaultSessions = (): SessionConfig[] => {
  return SESSIONS.map((s) => ({
    id: s.id,
    name: s.name,
    times: {
      startHour: s.startHour,
      startMinute: s.startMinute,
      endHour: s.endHour,
      endMinute: s.endMinute,
    },
    color: s.color,
  }));
};

const getDefaultSettings = (): UserSettings => ({
  sessions: getDefaultSessions(),
  killzones: DEFAULT_KILLZONES,
  lastModified: Date.now(),
});

interface SettingsState {
  settings: UserSettings | null;
  loaded: boolean;

  loadSettings: () => Promise<void>;
  updateSessionTimes: (sessionId: Session, times: TimeRange) => Promise<void>;
  updateKillzoneTimes: (killzoneId: Killzone, times: TimeRange) => Promise<void>;
  resetToDefaults: () => Promise<void>;

  // Derived getters
  getSessions: () => SessionConfig[];
  getKillzones: () => KillzoneInfo[];
  getKillzonesBySession: (session: Session) => KillzoneInfo[];
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  loaded: false,

  loadSettings: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ settings: parsed, loaded: true });
      } else {
        // First time - initialize with defaults
        const defaults = getDefaultSettings();
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
        set({ settings: defaults, loaded: true });
      }
    } catch (error) {
      logger.error('Failed to load settings:', error as Error);
      // Fallback to defaults
      set({ settings: getDefaultSettings(), loaded: true });
    }
  },

  updateSessionTimes: async (sessionId: Session, times: TimeRange) => {
    const current = get().settings || getDefaultSettings();
    const updated: UserSettings = {
      ...current,
      sessions: current.sessions.map((s) =>
        s.id === sessionId ? { ...s, times } : s
      ),
      lastModified: Date.now(),
    };

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ settings: updated });
    } catch (error) {
      logger.error('Failed to update session times:', error as Error);
    }
  },

  updateKillzoneTimes: async (killzoneId: Killzone, times: TimeRange) => {
    const current = get().settings || getDefaultSettings();
    const updated: UserSettings = {
      ...current,
      killzones: current.killzones.map((k) =>
        k.id === killzoneId ? { ...k, times } : k
      ),
      lastModified: Date.now(),
    };

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ settings: updated });
    } catch (error) {
      logger.error('Failed to update killzone times:', error as Error);
    }
  },

  resetToDefaults: async () => {
    const defaults = getDefaultSettings();
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      set({ settings: defaults });
    } catch (error) {
      logger.error('Failed to reset settings:', error as Error);
    }
  },

  // Getters
  getSessions: () => {
    const state = get();
    return state.settings?.sessions || getDefaultSessions();
  },

  getKillzones: () => {
    const state = get();
    return state.settings?.killzones || DEFAULT_KILLZONES;
  },

  getKillzonesBySession: (session: Session) => {
    const state = get();
    const killzones = state.settings?.killzones || DEFAULT_KILLZONES;
    return killzones.filter((k) => k.session === session);
  },
}));
