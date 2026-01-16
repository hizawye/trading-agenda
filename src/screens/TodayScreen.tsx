import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTradeStore } from '../stores/tradeStore';
import { useAlertStore } from '../stores/alertStore';
import { getCurrentSession, SESSIONS } from '../constants/sessions';
import { getCurrentKillzone } from '../constants/killzones';
import { formatTime, getTimeUntil, getNYTime, formatTimeRange } from '../lib/utils';
import { colors, typography, spacing, radii } from '../design/tokens';
import { pnlColor } from '../design/utils';
import { ScreenLayout } from '../components/ScreenLayout';
import { Card } from '../components/Card';
import { Stat } from '../components/Stat';
import { SessionBadge } from '../components/SessionBadge';
import { StatRow } from '../components/StatRow';

export default function TodayScreen({ navigation }: any) {
  const { trades, loadTrades, getTodayTrades, getTodayPnL, getWinRate } = useTradeStore();
  const { loadAlerts, getNextAlert, initializeNotifications } = useAlertStore();
  const [currentTime, setCurrentTime] = useState(getNYTime());

  useEffect(() => {
    loadTrades();
    loadAlerts();
    initializeNotifications();

    const timer = setInterval(() => setCurrentTime(getNYTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentSession = getCurrentSession();
  const currentKillzone = getCurrentKillzone();
  const nextAlert = getNextAlert();
  const todayTrades = getTodayTrades();
  const todayPnL = getTodayPnL();
  const winRate = getWinRate();
  const timeUntilNext = nextAlert ? getTimeUntil(nextAlert.time) : null;

  return (
    <ScreenLayout>
      {/* Current Session */}
      <Card spacious>
        <View style={styles.sessionCardContent}>
          {currentSession ? (
            <>
              <SessionBadge name={currentSession.name} color={currentSession.color} size="lg" />
              {currentKillzone && (
                <View style={styles.killzoneInfo}>
                  <Text style={styles.killzoneName}>{currentKillzone.name}</Text>
                  <Text style={styles.killzoneTime}>{formatTimeRange(currentKillzone.times)}</Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.offHours}>Off-hours</Text>
          )}
          <Text style={styles.currentTime}>
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} EST
          </Text>
        </View>
      </Card>

      {/* Next Alert */}
      {nextAlert && (
        <Card title="Next Alert">
          <Text style={styles.alertLabel}>{nextAlert.label}</Text>
          <Text style={styles.alertTime}>{formatTime(nextAlert.time)}</Text>
          {timeUntilNext && (
            <Text style={styles.countdown}>
              in {timeUntilNext.hours}h {timeUntilNext.minutes}m
            </Text>
          )}
        </Card>
      )}

      {/* Today's Summary */}
      <Card title="Today">
        <View style={styles.statsRow}>
          <Stat value={todayTrades.length} label="Trades" />
          <Stat
            value={`${todayPnL >= 0 ? '+' : ''}${todayPnL.toFixed(2)}`}
            label="P&L"
            color={pnlColor(todayPnL)}
          />
          <Stat value={`${winRate.toFixed(0)}%`} label="Win Rate" />
        </View>
      </Card>

      {/* Session Performance */}
      <Card title="Session Performance">
        {SESSIONS.map((session) => {
          const sessionTrades = trades.filter((t) => t.session === session.id && t.outcome !== 'pending');
          const wins = sessionTrades.filter((t) => t.outcome === 'win').length;
          const rate = sessionTrades.length > 0 ? (wins / sessionTrades.length) * 100 : 0;

          return (
            <StatRow
              key={session.id}
              label={session.name}
              icon={<View style={[styles.sessionDot, { backgroundColor: session.color }]} />}
              stats={[
                { label: 'Trades', value: sessionTrades.length },
                { label: 'Win Rate', value: `${rate.toFixed(0)}%` },
              ]}
            />
          );
        })}
      </Card>

      {/* Quick Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Journal')}
      >
        <Text style={styles.addButtonText}>+ Add Trade</Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  sessionCardContent: {
    alignItems: 'center',
  },
  killzoneInfo: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  killzoneName: {
    ...typography.body,
    fontWeight: '500',
  },
  killzoneTime: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  offHours: {
    ...typography.title,
    color: colors.text.tertiary,
  },
  currentTime: {
    ...typography.hero,
    marginTop: spacing.md,
  },
  alertLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  alertTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.semantic.success,
  },
  countdown: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sessionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  addButton: {
    backgroundColor: colors.semantic.success,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
