import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../design/tokens';
import { TIME_MACROS, formatTimeDisplay, getCurrentMacro } from '../lib/ictProfiles';

const TIMELINE_SESSIONS = [
  { id: 'asia', label: 'Asia', startHour: 20, endHour: 0, color: '#8B5CF6' },
  { id: 'london', label: 'London', startHour: 2, endHour: 5, color: '#3B82F6' },
  { id: 'ny_am', label: 'NY AM', startHour: 9, endHour: 12, color: '#10B981' },
  { id: 'ny_pm', label: 'NY PM', startHour: 13, endHour: 16, color: '#F59E0B' },
];

const MACRO_COLORS: Record<string, string> = {
  manipulation: '#F59E0B',
  expansion: '#10B981',
  accumulation: '#3B82F6',
};

export function SessionTimeline() {
  const activeMacro = getCurrentMacro();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Timeline</Text>

      <View style={styles.timeline}>
        {TIMELINE_SESSIONS.map((session) => {
          const sessionMacros = TIME_MACROS.filter((m) => m.session === session.id);
          const hasActiveMacro = activeMacro?.session === session.id;

          return (
            <View
              key={session.id}
              style={[
                styles.sessionBlock,
                { backgroundColor: session.color + (hasActiveMacro ? 'FF' : '40') },
                hasActiveMacro && styles.sessionBlockActive,
              ]}
            >
              <Text style={[styles.sessionLabel, hasActiveMacro && styles.sessionLabelActive]}>
                {session.label}
              </Text>
              <Text style={styles.sessionTime}>
                {session.startHour}:00 - {session.endHour}:00
              </Text>
              {sessionMacros.length > 0 && (
                <Text style={styles.macroCount}>{sessionMacros.length} macros</Text>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.macrosSection}>
        <Text style={styles.macrosTitle}>Time Macros (NY)</Text>
        {TIME_MACROS.map((macro) => {
          const isActive = activeMacro?.id === macro.id;
          const categoryColor = MACRO_COLORS[macro.category];

          return (
            <View
              key={macro.id}
              style={[styles.macroRow, isActive && styles.macroRowActive]}
            >
              <View style={styles.macroInfo}>
                <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
                <Text style={[styles.macroLabel, isActive && styles.macroLabelActive]}>
                  {macro.name}
                </Text>
              </View>
              <Text style={[styles.macroTime, isActive && styles.macroTimeActive]}>
                {formatTimeDisplay(macro.startTime)} - {formatTimeDisplay(macro.endTime)}
              </Text>
            </View>
          );
        })}
      </View>
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
  title: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  sessionBlock: {
    flex: 1,
    borderRadius: radii.sm,
    padding: spacing.sm,
    alignItems: 'center',
  },
  sessionBlockActive: {
    borderWidth: 2,
    borderColor: colors.text.primary,
  },
  sessionLabel: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '600',
  },
  sessionLabelActive: {
    fontWeight: 'bold',
  },
  sessionTime: {
    ...typography.caption,
    color: colors.text.primary,
    opacity: 0.7,
    fontSize: 10,
  },
  macroCount: {
    ...typography.caption,
    color: colors.text.primary,
    opacity: 0.5,
    fontSize: 9,
    marginTop: 2,
  },
  macrosSection: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.bg.tertiary,
  },
  macrosTitle: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.sm,
  },
  macroRowActive: {
    backgroundColor: colors.semantic.info + '20',
  },
  macroInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  macroLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  macroLabelActive: {
    color: colors.semantic.info,
    fontWeight: '600',
  },
  macroTime: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  macroTimeActive: {
    color: colors.semantic.info,
    fontWeight: '500',
  },
});
