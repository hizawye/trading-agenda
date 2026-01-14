import { Alert } from '../types';

// Default alerts based on trading notes - times in NY timezone
export const DEFAULT_ALERTS: Omit<Alert, 'id'>[] = [
  {
    time: '02:30',
    label: 'Position before Asia liquidity',
    description: 'Get ready - liquidity comes at 3am',
    enabled: true,
    days: [1, 2, 3, 4, 5], // Mon-Fri
  },
  {
    time: '03:00',
    label: 'Asia liquidity injection',
    description: '3am manipulation window starts',
    enabled: true,
    days: [1, 2, 3, 4, 5],
  },
  {
    time: '03:45',
    label: 'Position before 4am',
    description: 'Watch for accumulation and potential reversal',
    enabled: true,
    days: [1, 2, 3, 4, 5],
  },
  {
    time: '05:00',
    label: 'HOD/LOD formation',
    description: '5-5:30am often forms high/low of day',
    enabled: true,
    days: [1, 2, 3, 4, 5],
  },
  {
    time: '05:30',
    label: 'Great liquidity window',
    description: 'Watch what 5:30am establishes',
    enabled: true,
    days: [1, 2, 3, 4, 5],
  },
  {
    time: '07:15',
    label: 'Position before London liquidity',
    description: '7:30am continues what 5-5:30am manipulates',
    enabled: true,
    days: [1, 2, 3, 4, 5],
  },
  {
    time: '10:00',
    label: 'NY liquidity injection',
    description: '10am great liquidity - enter if at PD array',
    enabled: true,
    days: [1, 2, 3, 4, 5],
  },
  {
    time: '12:00',
    label: 'Reversal zone',
    description: '12pm reversal potential',
    enabled: true,
    days: [1, 2, 3, 4, 5],
  },
  {
    time: '13:45',
    label: 'Position for PM session',
    description: 'Liquidity comes back at 3pm',
    enabled: true,
    days: [1, 2, 3, 4, 5],
  },
  {
    time: '14:30',
    label: 'Final PM positioning',
    description: 'Position yourself 14:30-14:40 before 15:00',
    enabled: true,
    days: [1, 2, 3, 4, 5],
  },
];
