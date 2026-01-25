import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Stat } from './Stat';

interface Stats {
  trades: number;
  winRate: number;
  totalPnL: number;
  avgRR: number;
}

interface Props {
  stats: Stats;
}

export function FilterStats({ stats }: Props) {
  return (
    <Card>
      <View style={styles.statsRow}>
        <Stat value={stats.trades} label="Trades" />
        <Stat value={`${stats.winRate.toFixed(0)}%`} label="Win Rate" />
        <Stat value={`${stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(0)}`} label="P&L" />
        <Stat value={stats.avgRR.toFixed(1)} label="Avg RR" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
