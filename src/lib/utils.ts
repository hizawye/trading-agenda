import { TimeRange } from '../types';

// Get current date/time in New York timezone
export const getNYTime = (): Date => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(now);

  const getPart = (type: string) => parseInt(parts.find((p) => p.type === type)?.value || '0', 10);

  return new Date(
    getPart('year'),
    getPart('month') - 1, // Month is 0-indexed
    getPart('day'),
    getPart('hour'),
    getPart('minute'),
    getPart('second')
  );
};

// Get current NY hour (0-23)
export const getNYHour = (): number => {
  return getNYTime().getHours();
};

// Get current NY minute (0-59)
export const getNYMinute = (): number => {
  return getNYTime().getMinutes();
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Format TimeRange to readable string (e.g., "9:30 AM - 11:00 AM")
export const formatTimeRange = (times: TimeRange): string => {
  const startPeriod = times.startHour >= 12 ? 'PM' : 'AM';
  const endPeriod = times.endHour >= 12 ? 'PM' : 'AM';
  const startDisplayHour = times.startHour % 12 || 12;
  const endDisplayHour = times.endHour % 12 || 12;

  const startMin = times.startMinute.toString().padStart(2, '0');
  const endMin = times.endMinute.toString().padStart(2, '0');

  return `${startDisplayHour}:${startMin} ${startPeriod} - ${endDisplayHour}:${endMin} ${endPeriod}`;
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const getTimeUntil = (targetTime: string): { hours: number; minutes: number; isPast: boolean } => {
  const now = getNYTime(); // Use NY time instead of local
  const [targetHours, targetMinutes] = targetTime.split(':').map(Number);

  const target = new Date(now);
  target.setHours(targetHours, targetMinutes, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const diff = target.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes, isPast: false };
};

export const calculateRiskReward = (entry: number, stopLoss: number, takeProfit: number): number => {
  const risk = Math.abs(entry - stopLoss);
  const reward = Math.abs(takeProfit - entry);
  return risk > 0 ? reward / risk : 0;
};

/**
 * Convert NY time (hour/minute) to device local time for notification scheduling.
 * Expo-notifications fires at device local time, so we need to offset.
 */
export const convertNYTimeToLocal = (
  nyHour: number,
  nyMinute: number
): { hour: number; minute: number; dayOffset: number } => {
  const now = new Date();

  // Get current time in both NY and local to calculate offset
  const nyFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const localFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Get current time in both zones to calculate offset
  const nyParts = nyFormatter.formatToParts(now);
  const localParts = localFormatter.formatToParts(now);

  const getPart = (parts: Intl.DateTimeFormatPart[], type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value || '0', 10);

  const nyNowHour = getPart(nyParts, 'hour');
  const nyNowMinute = getPart(nyParts, 'minute');
  const localNowHour = getPart(localParts, 'hour');
  const localNowMinute = getPart(localParts, 'minute');

  // Calculate offset in minutes (local - NY)
  const nyTotalMinutes = nyNowHour * 60 + nyNowMinute;
  const localTotalMinutes = localNowHour * 60 + localNowMinute;
  let offsetMinutes = localTotalMinutes - nyTotalMinutes;

  // Handle day boundary (if offset crosses midnight due to date difference)
  if (offsetMinutes > 720) offsetMinutes -= 1440; // went past midnight forward
  if (offsetMinutes < -720) offsetMinutes += 1440; // went past midnight backward

  // Apply offset to NY alert time
  let localMinutes = nyHour * 60 + nyMinute + offsetMinutes;
  let dayOffset = 0;

  // Handle wraparound
  if (localMinutes < 0) {
    localMinutes += 1440;
    dayOffset = -1; // previous day
  } else if (localMinutes >= 1440) {
    localMinutes -= 1440;
    dayOffset = 1; // next day
  }

  return {
    hour: Math.floor(localMinutes / 60),
    minute: localMinutes % 60,
    dayOffset,
  };
};
