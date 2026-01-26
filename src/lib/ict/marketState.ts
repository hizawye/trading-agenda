import { CurrentMarketState, DailyBias, WeeklyTemplateId } from './types';
import { getCurrentSessionQuarter, getCurrentAMDPhase, getCurrentSessionName, getQuarterState } from './quarters';
import { getCurrentDayOfWeek, getDayProfile } from './weeklyProfiles';
import { getCurrentMacro, getNextMacro } from './timeMacros';
import { getIntradayProfile } from './amd';

// Legacy KEY_TIMES for backward compatibility
export const KEY_TIMES = [
  { label: 'Asia Open', time: '20:00', description: 'Asian session begins' },
  { label: 'Midnight Open', time: '00:00', description: 'True day open, new candle' },
  { label: 'London Open', time: '02:00', description: 'London killzone begins' },
  { label: 'London Close', time: '05:00', description: 'London killzone ends' },
  { label: 'NY Pre-Market', time: '08:30', description: 'Pre-market news window' },
  { label: 'NY Open', time: '09:30', description: 'NY AM killzone begins' },
  { label: 'Silver Bullet', time: '10:00', description: '10-11 AM optimal entry window' },
  { label: 'NY Lunch', time: '12:00', description: 'Avoid trading, low volume' },
  { label: 'NY PM Open', time: '13:30', description: 'PM session begins' },
  { label: 'Last Hour', time: '15:00', description: 'Final hour volatility' },
  { label: 'NY Close', time: '16:00', description: 'Regular session ends' },
];

export function getNextKeyTime(): { label: string; time: string; hoursAway: number; minutesAway: number } | null {
  const nextMacro = getNextMacro();
  if (nextMacro) {
    const hours = Math.floor(nextMacro.minutesAway / 60);
    const mins = nextMacro.minutesAway % 60;
    return {
      label: nextMacro.macro.name,
      time: nextMacro.macro.startTime,
      hoursAway: hours,
      minutesAway: mins,
    };
  }
  return null;
}

export function getCurrentMarketState(
  bias: DailyBias = 'neutral',
  isDelayed: boolean = false,
  templateId?: WeeklyTemplateId
): CurrentMarketState {
  const sq = getCurrentSessionQuarter();
  const dayOfWeek = getCurrentDayOfWeek();
  const dayProfile = getDayProfile(dayOfWeek, templateId);
  const amdPhase = getCurrentAMDPhase();
  const nextKeyTime = getNextKeyTime();
  const intradayProfile = getIntradayProfile(bias, isDelayed);
  const activeMacro = getCurrentMacro();
  const quarterState = getQuarterState();

  return {
    session: getCurrentSessionName(),
    sessionQuarter: sq?.quarter || 'Q1',
    amdPhase,
    dayOfWeek,
    dayProfile,
    intradayProfile,
    nextKeyTime,
    activeMacro,
    quarterState,
  };
}

export function formatTimeDisplay(time: string): string {
  const [hours, mins] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${mins.toString().padStart(2, '0')} ${period}`;
}
