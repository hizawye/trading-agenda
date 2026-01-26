import { create } from 'zustand';
import { Alert } from '../types';
import * as db from '../lib/database';
import { DEFAULT_ALERTS } from '../constants/defaultAlerts';
import { generateId, getNYTime } from '../lib/utils';
import {
  scheduleAlertNotification,
  cancelAlertNotification,
  scheduleAllAlerts,
  requestNotificationPermissions,
} from '../lib/notifications';

interface AlertState {
  alerts: Alert[];
  loading: boolean;
  notificationsEnabled: boolean;

  loadAlerts: () => Promise<void>;
  addAlert: (alert: Omit<Alert, 'id'>) => Promise<Alert>;
  updateAlert: (alert: Alert) => Promise<void>;
  toggleAlert: (id: string) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
  seedDefaultAlerts: () => Promise<void>;
  getNextAlert: () => Alert | null;
  initializeNotifications: () => Promise<void>;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  loading: false,
  notificationsEnabled: false,

  initializeNotifications: async () => {
    const granted = await requestNotificationPermissions();
    set({ notificationsEnabled: granted });
    // Don't schedule here - let loadAlerts handle it after alerts are loaded
  },

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

      // Schedule notifications after loading
      if (get().notificationsEnabled) {
        await scheduleAllAlerts(alerts);
      }
    } catch {
      set({ loading: false });
    }
  },

  addAlert: async (alertData) => {
    const alert: Alert = {
      ...alertData,
      id: generateId(),
    };

    try {
      await db.insertAlert(alert);
      set((state) => ({ alerts: [...state.alerts, alert].sort((a, b) => a.time.localeCompare(b.time)) }));

      // Schedule notification for new alert
      if (get().notificationsEnabled) {
        await scheduleAlertNotification(alert);
      }

      return alert;
    } catch (error) {
      console.error('Failed to add alert:', error);
      throw error;
    }
  },

  updateAlert: async (alert) => {
    try {
      await db.updateAlert(alert);
      set((state) => ({
        alerts: state.alerts.map((a) => (a.id === alert.id ? alert : a)),
      }));

      // Reschedule notification
      if (get().notificationsEnabled) {
        await scheduleAlertNotification(alert);
      }
    } catch (error) {
      console.error('Failed to update alert:', error);
      throw error;
    }
  },

  toggleAlert: async (id) => {
    const alert = get().alerts.find((a) => a.id === id);
    if (alert) {
      const updated = { ...alert, enabled: !alert.enabled };
      await get().updateAlert(updated);
    }
  },

  deleteAlert: async (id) => {
    // Cancel notification before deleting
    if (get().notificationsEnabled) {
      await cancelAlertNotification(id);
    }

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
    const now = getNYTime();
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
