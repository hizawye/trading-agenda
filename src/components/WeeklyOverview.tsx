import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../design/tokens';
import { WEEKLY_PROFILES, AMD_PHASES, WEEKLY_TEMPLATES } from '../lib/ictProfiles';
import { DayOfWeek, WeeklyTemplateId, DayProfile } from '../types/ict';

interface WeeklyOverviewProps {
  currentDay: DayOfWeek;
  templateId?: WeeklyTemplateId | null;
}

const DAY_ABBREV: Record<DayOfWeek, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
};

export function WeeklyOverview({ currentDay, templateId }: WeeklyOverviewProps) {
  const template = templateId ? WEEKLY_TEMPLATES[templateId] : null;
  const profiles: DayProfile[] = template ? template.profiles : WEEKLY_PROFILES;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {template ? template.name : 'Weekly Profile'}
      </Text>
      <View style={styles.grid}>
        {profiles.map((profile: DayProfile) => {
          const isToday = profile.day === currentDay;
          const phaseInfo = AMD_PHASES[profile.amdPhase];

          return (
            <View
              key={profile.day}
              style={[
                styles.dayCard,
                isToday && styles.dayCardActive,
                { borderLeftColor: phaseInfo.color },
              ]}
            >
              <Text style={[styles.dayLabel, isToday && styles.dayLabelActive]}>
                {DAY_ABBREV[profile.day]}
              </Text>
              <Text style={[styles.phaseLabel, { color: phaseInfo.color }]}>
                {phaseInfo.name.charAt(0)}
              </Text>
              <Text style={styles.actionLabel} numberOfLines={1}>
                {profile.expectedAction.replace('_', ' ')}
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
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  dayCard: {
    flex: 1,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radii.sm,
    padding: spacing.sm,
    alignItems: 'center',
    borderLeftWidth: 3,
  },
  dayCardActive: {
    backgroundColor: colors.bg.primary,
    borderWidth: 1,
    borderColor: colors.semantic.success,
  },
  dayLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  dayLabelActive: {
    color: colors.semantic.success,
  },
  phaseLabel: {
    ...typography.title,
    fontWeight: 'bold',
    marginVertical: spacing.xs,
  },
  actionLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 9,
    textTransform: 'capitalize',
  },
});
