import * as Notifications from 'expo-notifications';
import { Alert } from '../types';
import { convertNYTimeToLocal } from './utils';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') {
    return true;
  }

  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.warn('Failed to request notification permissions:', error);
    return false;
  }
};

export const scheduleAlertNotification = async (alert: Alert): Promise<string | null> => {
  if (!alert.enabled) return null;

  const [hours, minutes] = alert.time.split(':').map(Number);

  // Cancel any existing notification for this alert
  await cancelAlertNotification(alert.id);

  // Schedule for each enabled day
  const identifiers: string[] = [];

  // Convert NY time to device local time for correct notification firing
  const { hour: localHour, minute: localMinute, dayOffset } = convertNYTimeToLocal(hours, minutes);

  for (const day of alert.days) {
    // Adjust weekday if timezone conversion crosses midnight
    let adjustedWeekday = day + 1 + dayOffset; // Expo uses 1-7 (Sun-Sat), we use 0-6
    if (adjustedWeekday < 1) adjustedWeekday += 7;
    if (adjustedWeekday > 7) adjustedWeekday -= 7;

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: alert.label,
        body: alert.description || 'Time to check the markets',
        data: { alertId: alert.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: adjustedWeekday,
        hour: localHour,
        minute: localMinute,
      },
    });
    identifiers.push(identifier);
  }

  return identifiers[0] || null;
};

export const cancelAlertNotification = async (alertId: string): Promise<void> => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();

  for (const notification of scheduled) {
    if (notification.content.data?.alertId === alertId) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
};

export const scheduleAllAlerts = async (alerts: Alert[]): Promise<void> => {
  // Cancel all existing scheduled notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule enabled alerts
  for (const alert of alerts.filter((a) => a.enabled)) {
    await scheduleAlertNotification(alert);
  }
};

export const getScheduledNotifications = async () => {
  return Notifications.getAllScheduledNotificationsAsync();
};
