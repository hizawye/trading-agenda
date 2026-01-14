import { create } from 'zustand';
import { Alert } from '../types';
import * as db from '../lib/database';
import { DEFAULT_ALERTS } from '../constants/defaultAlerts';
import { generateId } from '../lib/utils';

interface AlertState {
  alerts: Alert[];
  loading: boolean;

  loadAlerts: () => Promise<void>;
  addAlert: (alert: Omit<Alert, 'id'>) => Promise<Alert>;
  updateAlert: (alert: Alert) => Promise<void>;
  toggleAlert: (id: string) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
  seedDefaultAlerts: () => Promise<void>;
  getNextAlert: () => Alert | null;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  loading: false,

  loadAlerts: async () => {
    set({ loading: true });
    try {
      let alerts = await db.getAllAlerts();

      // Seed defaults if empty
      if (alerts.length === 0) {
        await get().seedDefaultAlerts();
        alerts = await db.getAllAlerts();
      }

      set({ alerts, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addAlert: async (alertData) => {
    const alert: Alert = {
      ...alertData,
      id: generateId(),
    };
    await db.insertAlert(alert);
    set((state) => ({ alerts: [...state.alerts, alert].sort((a, b) => a.time.localeCompare(b.time)) }));
    return alert;
  },

  updateAlert: async (alert) => {
    await db.updateAlert(alert);
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === alert.id ? alert : a)),
    }));
  },

  toggleAlert: async (id) => {
    const alert = get().alerts.find((a) => a.id === id);
    if (alert) {
      const updated = { ...alert, enabled: !alert.enabled };
      await get().updateAlert(updated);
    }
  },

  deleteAlert: async (id) => {
    await db.deleteAlert(id);
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    }));
  },

  seedDefaultAlerts: async () => {
    for (const alertData of DEFAULT_ALERTS) {
      const alert: Alert = { ...alertData, id: generateId() };
      await db.insertAlert(alert);
    }
  },

  getNextAlert: () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay();

    const enabledAlerts = get().alerts.filter((a) => a.enabled && a.days.includes(currentDay));

    // Find next alert today
    const laterToday = enabledAlerts.find((a) => a.time > currentTime);
    if (laterToday) return laterToday;

    // Find first alert tomorrow
    const tomorrow = (currentDay + 1) % 7;
    const tomorrowAlerts = get().alerts.filter((a) => a.enabled && a.days.includes(tomorrow));
    return tomorrowAlerts[0] || null;
  },
}));
