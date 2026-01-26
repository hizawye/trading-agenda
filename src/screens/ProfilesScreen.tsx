import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useICTStore } from '../stores/ictStore';
import { INTRADAY_PROFILES } from '../lib/ictProfiles';
import { DailyBias } from '../types/ict';
import { colors, typography, spacing, radii } from '../design/tokens';
import { ScreenLayout } from '../components/ScreenLayout';
import { Card } from '../components/Card';
import { CurrentPhaseCard } from '../components/CurrentPhaseCard';
import { WeeklyOverview } from '../components/WeeklyOverview';
import { SessionTimeline } from '../components/SessionTimeline';
import { TemplateSelector } from '../components/TemplateSelector';

const BIAS_OPTIONS: { value: DailyBias; label: string; color: string }[] = [
  { value: 'bullish', label: 'Bullish', color: colors.semantic.success },
  { value: 'neutral', label: 'Neutral', color: colors.text.secondary },
  { value: 'bearish', label: 'Bearish', color: colors.semantic.error },
];

export default function ProfilesScreen() {
  const { bias, isDelayed, marketState, activeTemplateId, setBias, setDelayed, refreshMarketState, loadWeekTemplate } = useICTStore();

  // Load template and refresh market state on mount
  useEffect(() => {
    loadWeekTemplate();
  }, []);

  // Refresh market state every minute
  useEffect(() => {
    refreshMarketState();
    const interval = setInterval(refreshMarketState, 60000);
    return () => clearInterval(interval);
  }, []);

  const profile = marketState.intradayProfile ? INTRADAY_PROFILES[marketState.intradayProfile] : null;

  return (
    <ScreenLayout>
      {/* Current Phase */}
      <CurrentPhaseCard state={marketState} />

      {/* Daily Bias Toggle */}
      <Card title="Daily Bias">
        <View style={styles.biasRow}>
          {BIAS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.biasButton,
                bias === option.value && { backgroundColor: option.color + '30', borderColor: option.color },
              ]}
              onPress={() => setBias(option.value)}
            >
              <Text style={[styles.biasLabel, bias === option.value && { color: option.color }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.delayedToggle, isDelayed && styles.delayedToggleActive]}
          onPress={() => setDelayed(!isDelayed)}
        >
          <Text style={[styles.delayedLabel, isDelayed && styles.delayedLabelActive]}>
            Delayed Entry (Seek & Destroy)
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Today's Profile */}
      <Card title="Today's Expectation">
        <Text style={styles.dayTitle}>
          {marketState.dayOfWeek.charAt(0).toUpperCase() + marketState.dayOfWeek.slice(1)}
        </Text>
        <Text style={styles.dayDescription}>{marketState.dayProfile.description}</Text>

        {profile && (
          <View style={styles.profileSection}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileDesc}>{profile.description}</Text>
            <Text style={styles.entryWindow}>Entry: {profile.entryWindow}</Text>

            <View style={styles.characteristics}>
              {profile.characteristics.map((char: string, i: number) => (
                <Text key={i} style={styles.charItem}>
                  • {char}
                </Text>
              ))}
            </View>
          </View>
        )}

        {!profile && (
          <Text style={styles.neutralHint}>Select a bias above to see intraday profile</Text>
        )}
      </Card>

      {/* Weekly Template Selector */}
      <TemplateSelector />

      {/* Weekly Overview */}
      <WeeklyOverview currentDay={marketState.dayOfWeek} templateId={activeTemplateId} />

      {/* Session Timeline */}
      <SessionTimeline />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  biasRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  biasButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.bg.tertiary,
    alignItems: 'center',
  },
  biasLabel: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  delayedToggle: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.bg.tertiary,
    alignItems: 'center',
  },
  delayedToggleActive: {
    backgroundColor: colors.semantic.warning + '20',
    borderColor: colors.semantic.warning,
  },
  delayedLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  delayedLabelActive: {
    color: colors.semantic.warning,
    fontWeight: '600',
  },
  dayTitle: {
    ...typography.title,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  dayDescription: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  profileSection: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.bg.tertiary,
  },
  profileName: {
    ...typography.body,
    color: colors.semantic.info,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  profileDesc: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  entryWindow: {
    ...typography.caption,
    color: colors.semantic.success,
    marginBottom: spacing.sm,
  },
  characteristics: {
    marginTop: spacing.xs,
  },
  charItem: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  neutralHint: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
});
