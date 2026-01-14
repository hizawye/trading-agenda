import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTradeStore } from '../stores/tradeStore';
import { SESSIONS } from '../constants/sessions';
import { Session, SetupType } from '../types';

const SETUP_TYPES: SetupType[] = ['continuation', 'reversal', 'liquidity_sweep', 'fvg_fill', 'breakout', 'other'];

export default function AnalyticsScreen() {
  const { trades, loadTrades, getWinRate } = useTradeStore();

  useEffect(() => {
    loadTrades();
  }, []);

  const completedTrades = trades.filter((t) => t.outcome !== 'pending');
  const wins = completedTrades.filter((t) => t.outcome === 'win').length;
  const losses = completedTrades.filter((t) => t.outcome === 'loss').length;
  const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const avgRR = completedTrades.reduce((sum, t) => sum + (t.riskReward || 0), 0) / (completedTrades.length || 1);

  const getSessionStats = (sessionId: Session) => {
    const sessionTrades = completedTrades.filter((t) => t.session === sessionId);
    const sessionWins = sessionTrades.filter((t) => t.outcome === 'win').length;
    return {
      total: sessionTrades.length,
      winRate: sessionTrades.length > 0 ? (sessionWins / sessionTrades.length) * 100 : 0,
      pnl: trades.filter((t) => t.session === sessionId).reduce((sum, t) => sum + (t.pnl || 0), 0),
    };
  };

  const getSetupStats = (setup: SetupType) => {
    const setupTrades = completedTrades.filter((t) => t.setupType === setup);
    const setupWins = setupTrades.filter((t) => t.outcome === 'win').length;
    return {
      total: setupTrades.length,
      winRate: setupTrades.length > 0 ? (setupWins / setupTrades.length) * 100 : 0,
    };
  };

  return (
    <ScrollView style={styles.container}>
      {/* Overview */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{completedTrades.length}</Text>
            <Text style={styles.statLabel}>Total Trades</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: '#10B981' }]}>{wins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: '#EF4444' }]}>{losses}</Text>
            <Text style={styles.statLabel}>Losses</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{getWinRate().toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: totalPnL >= 0 ? '#10B981' : '#EF4444' }]}>
              {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Total P&L</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{avgRR.toFixed(2)}R</Text>
            <Text style={styles.statLabel}>Avg R:R</Text>
          </View>
        </View>
      </View>

      {/* By Session */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>By Session</Text>
        {SESSIONS.map((session) => {
          const stats = getSessionStats(session.id);
          return (
            <View key={session.id} style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.dot, { backgroundColor: session.color }]} />
                <Text style={styles.rowLabel}>{session.name}</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowStat}>{stats.total} trades</Text>
                <Text style={[styles.rowWinRate, { color: stats.winRate >= 50 ? '#10B981' : '#EF4444' }]}>
                  {stats.winRate.toFixed(0)}%
                </Text>
                <Text style={[styles.rowPnL, { color: stats.pnl >= 0 ? '#10B981' : '#EF4444' }]}>
                  {stats.pnl >= 0 ? '+' : ''}{stats.pnl.toFixed(0)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* By Setup */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>By Setup Type</Text>
        {SETUP_TYPES.map((setup) => {
          const stats = getSetupStats(setup);
          if (stats.total === 0) return null;
          return (
            <View key={setup} style={styles.row}>
              <Text style={styles.rowLabel}>{setup.replace('_', ' ')}</Text>
              <View style={styles.rowRight}>
                <Text style={styles.rowStat}>{stats.total} trades</Text>
                <Text style={[styles.rowWinRate, { color: stats.winRate >= 50 ? '#10B981' : '#EF4444' }]}>
                  {stats.winRate.toFixed(0)}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Streak */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Current Streak</Text>
        {(() => {
          let streak = 0;
          let streakType: 'win' | 'loss' | null = null;
          for (const trade of completedTrades) {
            if (trade.outcome === 'win' || trade.outcome === 'loss') {
              if (streakType === null) {
                streakType = trade.outcome;
                streak = 1;
              } else if (trade.outcome === streakType) {
                streak++;
              } else {
                break;
              }
            }
          }
          return (
            <View style={styles.streakContainer}>
              <Text style={[styles.streakValue, { color: streakType === 'win' ? '#10B981' : '#EF4444' }]}>
                {streak}
              </Text>
              <Text style={styles.streakLabel}>
                {streakType === 'win' ? 'Winning' : streakType === 'loss' ? 'Losing' : 'No'} streak
              </Text>
            </View>
          );
        })()}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  stat: { alignItems: 'center' },
  statValue: { color: '#F1F5F9', fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#64748B', fontSize: 12, marginTop: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  rowLabel: { color: '#F1F5F9', fontSize: 16, textTransform: 'capitalize' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  rowStat: { color: '#64748B', fontSize: 14 },
  rowWinRate: { fontSize: 16, fontWeight: '600', width: 50, textAlign: 'right' },
  rowPnL: { fontSize: 14, width: 60, textAlign: 'right' },
  streakContainer: { alignItems: 'center', paddingVertical: 16 },
  streakValue: { fontSize: 48, fontWeight: 'bold' },
  streakLabel: { color: '#94A3B8', fontSize: 16, marginTop: 8 },
});
