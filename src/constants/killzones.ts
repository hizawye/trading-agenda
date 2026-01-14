import { Killzone, KillzoneInfo } from '../types';
import { getNYTime } from '../lib/utils';

// ICT Killzone Definitions (Precise Trading Windows)
export const DEFAULT_KILLZONES: KillzoneInfo[] = [
  {
    id: 'asia_kz',
    name: 'Asia Killzone',
    description: '8pm-midnight NY time',
    times: { startHour: 20, startMinute: 0, endHour: 0, endMinute: 0 },
    color: '#8B5CF6', // Purple
    session: 'asia',
  },
  {
    id: 'london_kz',
    name: 'London Killzone',
    description: '2am-5am NY time',
    times: { startHour: 2, startMinute: 0, endHour: 5, endMinute: 0 },
    color: '#3B82F6', // Blue
    session: 'london',
  },
  {
    id: 'ny_am_kz',
    name: 'NY AM Killzone',
    description: '9:30am-11am NY time',
    times: { startHour: 9, startMinute: 30, endHour: 11, endMinute: 0 },
    color: '#10B981', // Green
    session: 'ny_am',
  },
  {
    id: 'ny_lunch',
    name: 'NY Lunch',
    description: 'Noon-1pm NY time (reversal zone)',
    times: { startHour: 12, startMinute: 0, endHour: 13, endMinute: 0 },
    color: '#F59E0B', // Amber
    session: 'ny_am',
  },
  {
    id: 'ny_pm_kz',
    name: 'NY PM Killzone',
    description: '1:30pm-4pm NY time',
    times: { startHour: 13, startMinute: 30, endHour: 16, endMinute: 0 },
    color: '#EF4444', // Red
    session: 'ny_pm',
  },
];

// Helper: Get killzone by ID
export const getKillzoneById = (id: Killzone): KillzoneInfo | undefined => {
  return DEFAULT_KILLZONES.find((k) => k.id === id);
};

// Helper: Get all killzones for a session
export const getKillzonesBySession = (session: string): KillzoneInfo[] => {
  return DEFAULT_KILLZONES.filter((k) => k.session === session);
};

// Helper: Check if current time is within a killzone
const isInKillzone = (kz: KillzoneInfo): boolean => {
  const now = getNYTime();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const { startHour, startMinute, endHour, endMinute } = kz.times;

  // Handle midnight wrap (e.g., Asia 20:00 -> 00:00)
  if (startHour > endHour) {
    // Wrapped case: check if after start OR before end
    if (hour > startHour || (hour === startHour && minute >= startMinute)) {
      return true;
    }
    if (hour < endHour || (hour === endHour && minute < endMinute)) {
      return true;
    }
    return false;
  }

  // Normal case: check if between start and end
  const currentMinutes = hour * 60 + minute;
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
};

// Helper: Get current active killzone
export const getCurrentKillzone = (): KillzoneInfo | null => {
  return DEFAULT_KILLZONES.find(isInKillzone) || null;
};
