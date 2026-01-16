import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, radii } from '../design/tokens';

interface SessionBadgeProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SessionBadge({ name, color, size = 'md' }: SessionBadgeProps) {
  const containerStyle =
    size === 'lg' ? styles.containerLg : size === 'sm' ? styles.containerSm : styles.container;
  const textStyle = size === 'lg' ? styles.textLg : size === 'sm' ? styles.textSm : styles.text;

  return (
    <View style={[containerStyle, { backgroundColor: color }]}>
      <Text style={textStyle}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
  containerLg: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    alignSelf: 'flex-start',
  },
  containerSm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  textLg: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  textSm: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
});
