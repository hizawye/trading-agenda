import { SessionInfo } from '../types';

export const SESSIONS: SessionInfo[] = [
  {
    id: 'asia',
    name: 'Asia',
    startHour: 0,
    endHour: 5,
    color: '#8B5CF6', // Purple
  },
  {
    id: 'london',
    name: 'London',
    startHour: 5,
    endHour: 10,
    color: '#3B82F6', // Blue
  },
  {
    id: 'ny_am',
    name: 'NY AM',
    startHour: 10,
    endHour: 14,
    color: '#10B981', // Green
  },
  {
    id: 'ny_pm',
    name: 'NY PM',
    startHour: 14,
    endHour: 20,
    color: '#F59E0B', // Amber
  },
];

export const getCurrentSession = (): SessionInfo | null => {
  const now = new Date();
  const hour = now.getHours();

  return SESSIONS.find(s => hour >= s.startHour && hour < s.endHour) || null;
};

export const getSessionById = (id: string): SessionInfo | undefined => {
  return SESSIONS.find(s => s.id === id);
};
