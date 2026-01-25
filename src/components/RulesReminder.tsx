import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Rule } from '../types';
import { colors, typography, spacing, radii } from '../design/tokens';

interface Props {
  rules: Rule[];
  onDismiss: () => void;
}

export function RulesReminder({ rules, onDismiss }: Props) {
  const activeRules = rules.filter(r => r.active);

  if (activeRules.length === 0) return null;

  return (
    <View style={styles.rulesReminder}>
      <View style={styles.rulesHeader}>
        <Text style={styles.rulesTitle}>📋 Active Rules ({activeRules.length})</Text>
        <TouchableOpacity onPress={onDismiss}>
          <Text style={styles.rulesDismiss}>✕</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rulesList}>
        {activeRules.slice(0, 3).map((rule) => (
          <Text key={rule.id} style={styles.ruleItem}>• {rule.rule}</Text>
        ))}
        {activeRules.length > 3 && (
          <Text style={styles.rulesMore}>+{activeRules.length - 3} more...</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rulesReminder: {
    backgroundColor: colors.bg.tertiary,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.semantic.warning,
  },
  rulesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  rulesTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
  },
  rulesDismiss: {
    ...typography.title,
    color: colors.text.tertiary,
  },
  rulesList: {
    gap: spacing.xs,
  },
  ruleItem: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  rulesMore: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
});
