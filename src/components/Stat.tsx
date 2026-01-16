import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../design/tokens';

interface StatProps {
  value: string | number;
  label: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Stat({ value, label, color, size = 'md' }: StatProps) {
  const valueStyle = size === 'lg' ? styles.valueLg : size === 'sm' ? styles.valueSm : styles.valueMd;

  return (
    <View style={styles.container}>
      <Text style={[valueStyle, color && { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  valueLg: {
    fontSize: 48,
    fontWeight: '200',
    lineHeight: 56,
    color: colors.text.primary,
  },
  valueMd: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
    color: colors.text.primary,
  },
  valueSm: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: colors.text.primary,
  },
  label: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});
