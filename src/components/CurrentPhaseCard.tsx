import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../design/tokens';
import { AMD_PHASES, formatTimeDisplay } from '../lib/ictProfiles';
import { CurrentMarketState } from '../types/ict';

interface CurrentPhaseCardProps {
  state: CurrentMarketState;
}

export function CurrentPhaseCard({ state }: CurrentPhaseCardProps) {
  const phaseInfo = AMD_PHASES[state.amdPhase];
  const nextTime = state.nextKeyTime;
  const activeMacro = state.activeMacro;
  const quarterState = state.quarterState;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.phaseBadge, { backgroundColor: phaseInfo.color }]}>
          <Text style={styles.phaseBadgeText}>{phaseInfo.name}</Text>
        </View>
        <Text style={styles.sessionLabel}>{state.session} {state.sessionQuarter}</Text>
      </View>

      <Text style={styles.description}>{phaseInfo.description}</Text>

      {/* Active Macro */}
      {activeMacro && (
        <View style={styles.macroContainer}>
          <View style={styles.macroHeader}>
            <Text style={styles.macroLabel}>Active Macro</Text>
            <Text style={styles.macroName}>{activeMacro.name}</Text>
          </View>
          <Text style={styles.macroTime}>
            {formatTimeDisplay(activeMacro.startTime)} - {formatTimeDisplay(activeMacro.endTime)}
          </Text>
          <Text style={styles.macroDesc}>{activeMacro.description}</Text>
        </View>
      )}

      {/* Micro Quarter Progress */}
      {quarterState && (
        <View style={styles.microContainer}>
          <View style={styles.microHeader}>
            <Text style={styles.microLabel}>Micro Quarter</Text>
            <Text style={styles.microValue}>{quarterState.quarter}.{quarterState.micro}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${quarterState.progress}%` }]} />
          </View>
          <View style={styles.microIndicators}>
            {[1, 2, 3, 4].map((m) => (
              <View
                key={m}
                style={[
                  styles.microDot,
                  quarterState.micro === m && styles.microDotActive,
                  quarterState.micro > m && styles.microDotComplete,
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {nextTime && (
        <View style={styles.nextTimeContainer}>
          <Text style={styles.nextTimeLabel}>Next: {nextTime.label}</Text>
          <Text style={styles.nextTimeValue}>
            {formatTimeDisplay(nextTime.time)} ({nextTime.hoursAway}h {nextTime.minutesAway}m)
          </Text>
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  phaseBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  phaseBadgeText: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  sessionLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  description: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  macroContainer: {
    backgroundColor: colors.bg.tertiary,
    borderRadius: radii.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  macroLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    fontSize: 10,
  },
  macroName: {
    ...typography.caption,
    color: colors.semantic.info,
    fontWeight: '600',
  },
  macroTime: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  macroDesc: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  microContainer: {
    marginBottom: spacing.sm,
  },
  microHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  microLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    fontSize: 10,
  },
  microValue: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.bg.tertiary,
    borderRadius: 2,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.semantic.info,
    borderRadius: 2,
  },
  microIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  microDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.bg.tertiary,
    borderWidth: 1,
    borderColor: colors.text.tertiary,
  },
  microDotActive: {
    backgroundColor: colors.semantic.info,
    borderColor: colors.semantic.info,
  },
  microDotComplete: {
    backgroundColor: colors.semantic.success,
    borderColor: colors.semantic.success,
  },
  nextTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.bg.tertiary,
  },
  nextTimeLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  nextTimeValue: {
    ...typography.caption,
    color: colors.semantic.info,
    fontWeight: '600',
  },
});
