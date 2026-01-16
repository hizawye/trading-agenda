import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../design/tokens';

interface CardProps {
  children: ReactNode;
  title?: string;
  spacious?: boolean;
}

export function Card({ children, title, spacious }: CardProps) {
  return (
    <View style={[styles.container, spacious && styles.spacious]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  spacious: {
    padding: spacing.lg,
  },
  title: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
});
