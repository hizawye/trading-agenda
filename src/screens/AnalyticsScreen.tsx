import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTradeStore } from '../stores/tradeStore';
import { SESSIONS } from '../constants/sessions';
import { DEFAULT_KILLZONES } from '../constants/killzones';
import { Session, SetupType, Killzone } from '../types';
import { colors, typography, spacing } from '../design/tokens';
import { pnlColor, winRateColor } from '../design/utils';
import { ScreenLayout } from '../components/ScreenLayout';
import { Card } from '../components/Card';
import { Stat } from '../components/Stat';
import { StatRow } from '../components/StatRow';

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

  const getKillzoneStats = (killzoneId: Killzone) => {
    const kzTrades = completedTrades.filter((t) => t.killzone === killzoneId);
    const kzWins = kzTrades.filter((t) => t.outcome === 'win').length;
    return {
      total: kzTrades.length,
      winRate: kzTrades.length > 0 ? (kzWins / kzTrades.length) * 100 : 0,
      pnl: trades.filter((t) => t.killzone === killzoneId).reduce((sum, t) => sum + (t.pnl || 0), 0),
    };
  };

  const getStreak = () => {
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
    return { streak, streakType };
  };

  const { streak, streakType } = getStreak();

  return (
    <ScreenLayout>
      {/* Overview */}
      <Card title="Overview">
        <View style={styles.statsGrid}>
          <Stat value={completedTrades.length} label="Total" size="sm" />
          <Stat value={wins} label="Wins" size="sm" color={colors.semantic.success} />
          <Stat value={losses} label="Losses" size="sm" color={colors.semantic.error} />
          <Stat value={`${getWinRate().toFixed(0)}%`} label="Win Rate" size="sm" />
        </View>
        <View style={styles.divider} />
        <View style={styles.statsRow}>
          <Stat
            value={`${totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}`}
            label="Total P&L"
            size="sm"
            color={pnlColor(totalPnL)}
          />
          <Stat value={`${avgRR.toFixed(2)}R`} label="Avg R:R" size="sm" />
        </View>
      </Card>

      {/* By Session */}
      <Card title="By Session">
        {SESSIONS.map((session) => {
          const stats = getSessionStats(session.id);
          return (
            <StatRow
              key={session.id}
              label={session.name}
              icon={<View style={[styles.dot, { backgroundColor: session.color }]} />}
              stats={[
                { label: 'Trades', value: stats.total },
                { label: 'Win %', value: `${stats.winRate.toFixed(0)}%`, color: winRateColor(stats.winRate) },
                { label: 'P&L', value: `${stats.pnl >= 0 ? '+' : ''}${stats.pnl.toFixed(0)}`, color: pnlColor(stats.pnl) },
              ]}
            />
          );
        })}
      </Card>

      {/* By Killzone */}
      <Card title="By Killzone">
        {DEFAULT_KILLZONES.map((kz) => {
          const stats = getKillzoneStats(kz.id);
          if (stats.total === 0) return null;
          return (
            <StatRow
              key={kz.id}
              label={kz.name}
              icon={<View style={[styles.dot, { backgroundColor: kz.color }]} />}
              stats={[
                { label: 'Trades', value: stats.total },
                { label: 'Win %', value: `${stats.winRate.toFixed(0)}%`, color: winRateColor(stats.winRate) },
                { label: 'P&L', value: `${stats.pnl >= 0 ? '+' : ''}${stats.pnl.toFixed(0)}`, color: pnlColor(stats.pnl) },
              ]}
            />
          );
        })}
      </Card>

      {/* By Setup */}
      <Card title="By Setup Type">
        {SETUP_TYPES.map((setup) => {
          const stats = getSetupStats(setup);
          if (stats.total === 0) return null;
          return (
            <StatRow
              key={setup}
              label={setup.replace('_', ' ')}
              stats={[
                { label: 'Trades', value: stats.total },
                { label: 'Win %', value: `${stats.winRate.toFixed(0)}%`, color: winRateColor(stats.winRate) },
              ]}
            />
          );
        })}
      </Card>

      {/* Streak */}
      <Card title="Current Streak">
        <View style={styles.streakContainer}>
          <Text style={[styles.streakValue, { color: streakType === 'win' ? colors.semantic.success : colors.semantic.error }]}>
            {streak}
          </Text>
          <Text style={styles.streakLabel}>
            {streakType === 'win' ? 'Winning' : streakType === 'loss' ? 'Losing' : 'No'} streak
          </Text>
        </View>
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: colors.bg.tertiary,
    marginVertical: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  streakContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  streakValue: {
    ...typography.hero,
    fontWeight: 'bold',
  },
  streakLabel: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
});
