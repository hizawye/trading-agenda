import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTradeStore } from '../stores/tradeStore';
import { useAlertStore } from '../stores/alertStore';
import { getCurrentSession, SESSIONS } from '../constants/sessions';
import { getCurrentKillzone } from '../constants/killzones';
import { formatTime, getTimeUntil, getNYTime, formatTimeRange } from '../lib/utils';

export default function HomeScreen({ navigation }: any) {
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
    <ScrollView style={styles.container}>
      {/* Current Session */}
      <View style={styles.sessionCard}>
        <Text style={styles.sectionTitle}>Current Session</Text>
        {currentSession ? (
          <>
            <View style={[styles.sessionBadge, { backgroundColor: currentSession.color }]}>
              <Text style={styles.sessionText}>{currentSession.name}</Text>
            </View>
            {currentKillzone && (
              <>
                <Text style={styles.killzoneName}>{currentKillzone.name}</Text>
                <Text style={styles.killzoneTime}>
                  {formatTimeRange(currentKillzone.times)}
                </Text>
              </>
            )}
          </>
        ) : (
          <Text style={styles.offHours}>Off-hours</Text>
        )}
        <Text style={styles.currentTime}>
          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} EST
        </Text>
      </View>

      {/* Next Alert */}
      {nextAlert && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Next Alert</Text>
          <Text style={styles.alertLabel}>{nextAlert.label}</Text>
          <Text style={styles.alertTime}>{formatTime(nextAlert.time)}</Text>
          {timeUntilNext && (
            <Text style={styles.countdown}>
              in {timeUntilNext.hours}h {timeUntilNext.minutes}m
            </Text>
          )}
        </View>
      )}

      {/* Today's Summary */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{todayTrades.length}</Text>
            <Text style={styles.statLabel}>Trades</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: todayPnL >= 0 ? '#10B981' : '#EF4444' }]}>
              {todayPnL >= 0 ? '+' : ''}{todayPnL.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>P&L</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{winRate.toFixed(0)}%</Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
        </View>
      </View>

      {/* Session Win Rates */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Session Performance</Text>
        <View style={styles.sessionGrid}>
          {SESSIONS.map((session) => {
            const sessionTrades = trades.filter((t) => t.session === session.id && t.outcome !== 'pending');
            const wins = sessionTrades.filter((t) => t.outcome === 'win').length;
            const rate = sessionTrades.length > 0 ? (wins / sessionTrades.length) * 100 : 0;

            return (
              <View key={session.id} style={styles.sessionStat}>
                <View style={[styles.sessionDot, { backgroundColor: session.color }]} />
                <Text style={styles.sessionName}>{session.name}</Text>
                <Text style={styles.sessionRate}>{rate.toFixed(0)}%</Text>
                <Text style={styles.sessionCount}>{sessionTrades.length} trades</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Quick Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Journal', { screen: 'AddTrade' })}
      >
        <Text style={styles.addButtonText}>+ Add Trade</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 16,
  },
  sessionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sessionBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 8,
  },
  sessionText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  offHours: {
    color: '#64748B',
    fontSize: 24,
    marginBottom: 8,
  },
  killzoneName: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  killzoneTime: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 4,
  },
  currentTime: {
    color: '#F1F5F9',
    fontSize: 48,
    fontWeight: '200',
  },
  alertLabel: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertTime: {
    color: '#10B981',
    fontSize: 32,
    fontWeight: 'bold',
  },
  countdown: {
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: '#F1F5F9',
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  sessionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sessionStat: {
    width: '48%',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  sessionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  sessionName: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '600',
  },
  sessionRate: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sessionCount: {
    color: '#64748B',
    fontSize: 12,
  },
  addButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
