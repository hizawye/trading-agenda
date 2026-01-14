import { SessionInfo } from '../types';
import { getNYTime } from '../lib/utils';

// ICT Session Definitions (Broad Overview)
export const SESSIONS: SessionInfo[] = [
  {
    id: 'asia',
    name: 'Asia',
    startHour: 20,
    startMinute: 0,
    endHour: 5,
    endMinute: 0,
    color: '#8B5CF6', // Purple
  },
  {
    id: 'london',
    name: 'London',
    startHour: 2,
    startMinute: 0,
    endHour: 10,
    endMinute: 0,
    color: '#3B82F6', // Blue
  },
  {
    id: 'ny_am',
    name: 'NY AM',
    startHour: 9,
    startMinute: 30,
    endHour: 14,
    endMinute: 0,
    color: '#10B981', // Green
  },
  {
    id: 'ny_pm',
    name: 'NY PM',
    startHour: 14,
    startMinute: 0,
    endHour: 16,
    endMinute: 0,
    color: '#F59E0B', // Amber
  },
];

export const getCurrentSession = (): SessionInfo | null => {
  const now = getNYTime();
  const hour = now.getHours();
  const minute = now.getMinutes();

  for (const session of SESSIONS) {
    const { startHour, startMinute, endHour, endMinute } = session;

    // Handle midnight wrap (e.g., Asia 20:00 -> 05:00)
    if (startHour > endHour) {
      // Wrapped case: check if after start OR before end
      if (hour > startHour || (hour === startHour && minute >= startMinute)) {
        return session;
      }
      if (hour < endHour || (hour === endHour && minute < endMinute)) {
        return session;
      }
    } else {
      // Normal case: check if between start and end
      const currentMinutes = hour * 60 + minute;
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        return session;
      }
    }
  }

  return null;
};

export const getSessionById = (id: string): SessionInfo | undefined => {
  return SESSIONS.find(s => s.id === id);
};
