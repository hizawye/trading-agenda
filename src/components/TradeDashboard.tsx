import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SessionBadge } from './SessionBadge';
import { Stat } from './Stat';
import { colors, typography, spacing, radii } from '../design/tokens';
import { pnlColor } from '../design/utils';
import { formatTime, getTimeUntil } from '../lib/utils';
import { Alert as AlertType } from '../types';

interface SessionInfo {
  id: string;
  name: string;
  color: string;
}

interface TodayStats {
  tradeCount: number;
  pnl: number;
  winRate: number;
}

interface Props {
  currentSession: SessionInfo | null;
  currentTime: Date;
  nextAlert: AlertType | null;
  todayStats: TodayStats;
}

export function TradeDashboard({ currentSession, currentTime, nextAlert, todayStats }: Props) {
  const timeUntilNext = nextAlert ? getTimeUntil(nextAlert.time) : null;

  return (
    <View style={styles.dashboard}>
      <View style={styles.headerRow}>
        <View>
          {currentSession ? (
            <SessionBadge name={currentSession.name} color={currentSession.color} size="md" />
          ) : (
            <Text style={styles.offHours}>OFF</Text>
          )}
          <Text style={styles.currentTime}>
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} EST
          </Text>
        </View>

        {nextAlert ? (
          <View style={styles.nextAlert}>
            <Text style={styles.nextAlertLabel}>Next: {nextAlert.label}</Text>
            <Text style={styles.nextAlertTime}>
              {formatTime(nextAlert.time)}
              {timeUntilNext && <Text style={{ fontWeight: '400' }}> ({timeUntilNext.hours}h {timeUntilNext.minutes}m)</Text>}
            </Text>
          </View>
        ) : (
          <View style={styles.nextAlert}><Text style={styles.nextAlertLabel}>No upcoming alerts</Text></View>
        )}
      </View>

      <View style={styles.todayStats}>
        <Stat value={todayStats.tradeCount} label="Today" />
        <Stat
          value={`${todayStats.pnl >= 0 ? '+' : ''}${todayStats.pnl.toFixed(2)}`}
          label="P&L"
          color={pnlColor(todayStats.pnl)}
        />
        <Stat value={`${todayStats.winRate.toFixed(0)}%`} label="Win %" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dashboard: {
    padding: spacing.md,
    backgroundColor: colors.bg.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.tertiary,
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  offHours: {
    ...typography.title,
    color: colors.text.tertiary,
    fontWeight: 'bold',
  },
  currentTime: {
    ...typography.heading,
    color: colors.text.primary,
    marginTop: 2,
  },
  nextAlert: {
    alignItems: 'flex-end',
  },
  nextAlertLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  nextAlertTime: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.semantic.success,
  },
  todayStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.bg.tertiary,
    padding: spacing.sm,
    borderRadius: radii.md,
  },
});
