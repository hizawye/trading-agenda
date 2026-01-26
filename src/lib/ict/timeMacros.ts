import { TimeMacro } from './types';
import { getNYTime } from '../utils';

export const TIME_MACROS: TimeMacro[] = [
  {
    id: 'london_preopen',
    name: 'London Pre-Open',
    startTime: '02:33',
    endTime: '03:00',
    session: 'london',
    category: 'manipulation',
    description: 'Pre-London liquidity sweep',
  },
  {
    id: 'london_open',
    name: 'London Open',
    startTime: '04:03',
    endTime: '04:30',
    session: 'london',
    category: 'expansion',
    description: 'London open expansion',
  },
  {
    id: 'ny_am',
    name: 'NY AM Macro',
    startTime: '08:50',
    endTime: '09:10',
    session: 'ny_am',
    category: 'manipulation',
    description: 'Pre-market manipulation',
  },
  {
    id: 'silver_bullet',
    name: 'Silver Bullet',
    startTime: '09:50',
    endTime: '10:10',
    session: 'ny_am',
    category: 'expansion',
    description: 'ICT Silver Bullet setup window',
  },
  {
    id: 'london_fix',
    name: 'London Fix',
    startTime: '10:50',
    endTime: '11:10',
    session: 'ny_am',
    category: 'expansion',
    description: 'London fix settlement',
  },
  {
    id: 'ny_am_close',
    name: 'NY AM Close',
    startTime: '11:50',
    endTime: '12:10',
    session: 'ny_am',
    category: 'accumulation',
    description: 'AM session wind-down',
  },
  {
    id: 'ny_lunch',
    name: 'NY Lunch',
    startTime: '13:10',
    endTime: '13:40',
    session: 'ny_pm',
    category: 'accumulation',
    description: 'Avoid - low volume chop',
  },
  {
    id: 'ny_pm_close',
    name: 'NY PM Close',
    startTime: '15:15',
    endTime: '15:45',
    session: 'ny_pm',
    category: 'expansion',
    description: 'Final hour volatility',
  },
];

function parseTime(time: string): number {
  const [hours, mins] = time.split(':').map(Number);
  return hours * 60 + mins;
}

export function getCurrentMacro(): TimeMacro | null {
  const now = getNYTime();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const macro of TIME_MACROS) {
    const start = parseTime(macro.startTime);
    const end = parseTime(macro.endTime);

    if (currentMinutes >= start && currentMinutes < end) {
      return macro;
    }
  }

  return null;
}

export function getNextMacro(): { macro: TimeMacro; minutesAway: number } | null {
  const now = getNYTime();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Find next macro today
  for (const macro of TIME_MACROS) {
    const start = parseTime(macro.startTime);
    if (start > currentMinutes) {
      return { macro, minutesAway: start - currentMinutes };
    }
  }

  // Wrap to first macro tomorrow
  if (TIME_MACROS.length > 0) {
    const first = TIME_MACROS[0];
    const start = parseTime(first.startTime);
    const minutesAway = 24 * 60 - currentMinutes + start;
    return { macro: first, minutesAway };
  }

  return null;
}

export function getMacroProgress(): number {
  const now = getNYTime();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const macro = getCurrentMacro();

  if (!macro) return 0;

  const start = parseTime(macro.startTime);
  const end = parseTime(macro.endTime);
  const duration = end - start;
  const elapsed = currentMinutes - start;

  return Math.min(100, Math.max(0, (elapsed / duration) * 100));
}
