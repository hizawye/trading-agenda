import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../design/tokens';

interface StatItem {
  label: string;
  value: string | number;
  color?: string;
}

interface StatRowProps {
  label: string;
  icon?: ReactNode;
  stats: StatItem[];
}

export function StatRow({ label, icon, stats }: StatRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {icon}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.right}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.stat}>
            <Text style={[styles.value, stat.color && { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  right: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  label: {
    ...typography.body,
    color: colors.text.primary,
  },
  stat: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statLabel: {
    ...typography.caption,
    fontSize: 10,
  },
});
