import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors, typography, spacing, radii } from '../design/tokens';
import { ScreenLayout } from '../components/ScreenLayout';
import { Card } from '../components/Card';
import {
  ICT_CORE_CONCEPTS,
  ICT_SETUPS,
  PD_ARRAYS,
  DAILY_SESSIONS,
  ICT_FIB_LEVELS,
  ICT_RISK_RULES,
  CYCLE_DAYS,
  TIME_MACROS,
  ConceptCategory,
} from '../lib/ict';

type TabId = 'concepts' | 'setups' | 'time' | 'structure' | 'rules';

const TABS: { id: TabId; label: string }[] = [
  { id: 'concepts', label: 'Concepts' },
  { id: 'setups', label: 'Setups' },
  { id: 'time', label: 'Time' },
  { id: 'structure', label: 'Structure' },
  { id: 'rules', label: 'Rules' },
];

const CATEGORY_LABELS: Record<ConceptCategory, string> = {
  market_structure: 'Market Structure',
  liquidity: 'Liquidity',
  order_flow: 'Order Flow',
  time_theory: 'Time Theory',
  entry_models: 'Entry Models',
  price_arrays: 'Price Arrays',
};

const CATEGORY_COLORS: Record<ConceptCategory, string> = {
  market_structure: '#3B82F6',
  liquidity: '#EF4444',
  order_flow: '#10B981',
  time_theory: '#F59E0B',
  entry_models: '#8B5CF6',
  price_arrays: '#EC4899',
};

export default function ICTReferenceScreen() {
  const [activeTab, setActiveTab] = useState<TabId>('concepts');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);

  const filteredConcepts = ICT_CORE_CONCEPTS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedConcepts = filteredConcepts.reduce((acc, concept) => {
    if (!acc[concept.category]) acc[concept.category] = [];
    acc[concept.category].push(concept);
    return acc;
  }, {} as Record<ConceptCategory, typeof ICT_CORE_CONCEPTS>);

  return (
    <ScreenLayout>
      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
        <View style={styles.tabRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Concepts Tab */}
      {activeTab === 'concepts' && (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder="Search concepts..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {Object.entries(groupedConcepts).map(([category, concepts]) => (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryDot, { backgroundColor: CATEGORY_COLORS[category as ConceptCategory] }]} />
                <Text style={styles.categoryTitle}>
                  {CATEGORY_LABELS[category as ConceptCategory]}
                </Text>
              </View>

              {concepts.map((concept) => (
                <TouchableOpacity
                  key={concept.id}
                  style={styles.conceptCard}
                  onPress={() => setExpandedConcept(expandedConcept === concept.id ? null : concept.id)}
                >
                  <View style={styles.conceptHeader}>
                    <Text style={styles.conceptName}>{concept.name}</Text>
                    <Text style={styles.expandIcon}>{expandedConcept === concept.id ? '−' : '+'}</Text>
                  </View>
                  {expandedConcept === concept.id && (
                    <Text style={styles.conceptDesc}>{concept.description}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </>
      )}

      {/* Setups Tab */}
      {activeTab === 'setups' && (
        <>
          {ICT_SETUPS.map((setup) => (
            <Card key={setup.id} title={setup.name}>
              <View style={styles.setupTimeWindow}>
                <Text style={styles.timeWindowLabel}>Window:</Text>
                <Text style={styles.timeWindowValue}>{setup.timeWindow}</Text>
              </View>
              <Text style={styles.setupDesc}>{setup.description}</Text>
              <Text style={styles.stepsTitle}>Steps:</Text>
              {setup.steps.map((step, i) => (
                <Text key={i} style={styles.stepItem}>
                  {i + 1}. {step}
                </Text>
              ))}
              {setup.fibTargets && (
                <>
                  <Text style={styles.fibTitle}>Fib Targets:</Text>
                  <Text style={styles.fibTargets}>{setup.fibTargets.join(' → ')}</Text>
                </>
              )}
            </Card>
          ))}
        </>
      )}

      {/* Time Tab */}
      {activeTab === 'time' && (
        <>
          <Card title="Time Macros">
            {TIME_MACROS.map((macro) => (
              <View key={macro.id} style={styles.macroRow}>
                <View style={styles.macroInfo}>
                  <Text style={styles.macroName}>{macro.name}</Text>
                  <Text style={styles.macroTime}>{macro.startTime} - {macro.endTime}</Text>
                </View>
                <View style={[styles.categoryBadge, { backgroundColor: macro.category === 'expansion' ? '#10B981' : macro.category === 'manipulation' ? '#F59E0B' : '#3B82F6' }]}>
                  <Text style={styles.categoryBadgeText}>{macro.category.slice(0, 3).toUpperCase()}</Text>
                </View>
              </View>
            ))}
          </Card>

          <Card title="Daily Sessions">
            {DAILY_SESSIONS.map((session) => (
              <View key={session.id} style={styles.sessionRow}>
                <View style={styles.sessionInfo}>
                  <Text style={[styles.sessionName, !session.tradeable && styles.sessionNameMuted]}>
                    {session.name}
                  </Text>
                  <Text style={styles.sessionTime}>{session.startTime} - {session.endTime}</Text>
                </View>
                <View style={[styles.tradeableBadge, { backgroundColor: session.tradeable ? colors.semantic.success : colors.semantic.error }]}>
                  <Text style={styles.tradeableBadgeText}>{session.tradeable ? 'TRADE' : 'AVOID'}</Text>
                </View>
              </View>
            ))}
          </Card>

          <Card title="Taylor 3-Day Cycle">
            {Object.values(CYCLE_DAYS).map((day) => (
              <View key={day.day} style={[styles.cycleDay, { borderLeftColor: day.color }]}>
                <Text style={styles.cycleDayName}>{day.name}</Text>
                <Text style={styles.cycleDayDesc}>{day.description}</Text>
                <Text style={styles.cycleDayAction}>{day.action}</Text>
              </View>
            ))}
          </Card>
        </>
      )}

      {/* Structure Tab */}
      {activeTab === 'structure' && (
        <>
          <Card title="PD Array Hierarchy">
            <Text style={styles.pdArraySubtitle}>Priority order (highest to lowest):</Text>
            {PD_ARRAYS.map((arr, i) => (
              <View key={arr.id} style={styles.pdArrayRow}>
                <View style={styles.pdArrayRank}>
                  <Text style={styles.pdArrayRankText}>{i + 1}</Text>
                </View>
                <View style={styles.pdArrayInfo}>
                  <Text style={styles.pdArrayName}>{arr.name}</Text>
                  <Text style={styles.pdArrayDesc}>{arr.description}</Text>
                </View>
              </View>
            ))}
          </Card>

          <Card title="Fibonacci Levels">
            <Text style={styles.fibSectionTitle}>Entry (Retracement)</Text>
            <View style={styles.fibGrid}>
              <View style={styles.fibItem}>
                <Text style={styles.fibLevel}>50%</Text>
                <Text style={styles.fibLabel}>Equilibrium</Text>
              </View>
              <View style={styles.fibItem}>
                <Text style={[styles.fibLevel, { color: colors.semantic.success }]}>62%</Text>
                <Text style={styles.fibLabel}>OTE Zone</Text>
              </View>
              <View style={styles.fibItem}>
                <Text style={styles.fibLevel}>70.5%</Text>
                <Text style={styles.fibLabel}>Deep</Text>
              </View>
              <View style={styles.fibItem}>
                <Text style={styles.fibLevel}>79%</Text>
                <Text style={styles.fibLabel}>Extreme</Text>
              </View>
            </View>

            <Text style={styles.fibSectionTitle}>Targets (Extension)</Text>
            <View style={styles.fibGrid}>
              <View style={styles.fibItem}>
                <Text style={styles.fibLevel}>-1</Text>
                <Text style={styles.fibLabel}>1:1</Text>
              </View>
              <View style={styles.fibItem}>
                <Text style={styles.fibLevel}>-1.5</Text>
                <Text style={styles.fibLabel}>Standard</Text>
              </View>
              <View style={styles.fibItem}>
                <Text style={[styles.fibLevel, { color: colors.semantic.success }]}>-2</Text>
                <Text style={styles.fibLabel}>Full</Text>
              </View>
              <View style={styles.fibItem}>
                <Text style={styles.fibLevel}>-2.5</Text>
                <Text style={styles.fibLabel}>Extended</Text>
              </View>
            </View>
          </Card>
        </>
      )}

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <>
          <Card title="Risk Management">
            <View style={styles.riskRow}>
              <Text style={styles.riskLabel}>Risk per trade:</Text>
              <Text style={styles.riskValue}>{ICT_RISK_RULES.maxRiskPerTrade}%</Text>
            </View>
            <View style={styles.riskRow}>
              <Text style={styles.riskLabel}>Conservative risk:</Text>
              <Text style={styles.riskValue}>{ICT_RISK_RULES.conservativeRisk}%</Text>
            </View>
            <View style={styles.riskRow}>
              <Text style={styles.riskLabel}>Max daily drawdown:</Text>
              <Text style={styles.riskValue}>{ICT_RISK_RULES.maxDailyRisk}%</Text>
            </View>
            <View style={styles.riskRow}>
              <Text style={styles.riskLabel}>Minimum R:R:</Text>
              <Text style={styles.riskValue}>{ICT_RISK_RULES.targetRR}:1</Text>
            </View>
          </Card>

          <Card title="Scalping Rules">
            <View style={styles.riskRow}>
              <Text style={styles.riskLabel}>Target:</Text>
              <Text style={styles.riskValue}>{ICT_RISK_RULES.scalping.targetPips} pips</Text>
            </View>
            <View style={styles.riskRow}>
              <Text style={styles.riskLabel}>Max duration:</Text>
              <Text style={styles.riskValue}>{ICT_RISK_RULES.scalping.maxDuration}</Text>
            </View>
          </Card>

          <Card title="Key Principles">
            <Text style={styles.principle}>• Trade only in kill zones</Text>
            <Text style={styles.principle}>• Wait for displacement before entry</Text>
            <Text style={styles.principle}>• OTE at 62% retracement</Text>
            <Text style={styles.principle}>• Target draw on liquidity</Text>
            <Text style={styles.principle}>• Avoid FOMC and NFP days</Text>
            <Text style={styles.principle}>• Avoid NY lunch (12:00-13:30)</Text>
            <Text style={styles.principle}>• Friday = reduced size (TGIF)</Text>
            <Text style={styles.principle}>• Patience over frequency</Text>
          </Card>
        </>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  tabScroll: {
    marginBottom: spacing.md,
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    backgroundColor: colors.bg.secondary,
  },
  tabActive: {
    backgroundColor: colors.semantic.info,
  },
  tabText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.text.primary,
  },
  searchInput: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radii.md,
    padding: spacing.md,
    color: colors.text.primary,
    marginBottom: spacing.md,
    ...typography.body,
  },
  categorySection: {
    marginBottom: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  conceptCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  conceptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conceptName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  expandIcon: {
    ...typography.title,
    color: colors.text.tertiary,
  },
  conceptDesc: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  setupTimeWindow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  timeWindowLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  timeWindowValue: {
    ...typography.caption,
    color: colors.semantic.info,
    fontWeight: '600',
  },
  setupDesc: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  stepsTitle: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  stepItem: {
    ...typography.caption,
    color: colors.text.primary,
    marginBottom: 4,
    paddingLeft: spacing.sm,
  },
  fibTitle: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  fibTargets: {
    ...typography.caption,
    color: colors.semantic.success,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.tertiary,
  },
  macroInfo: {
    flex: 1,
  },
  macroName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  macroTime: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  categoryBadgeText: {
    ...typography.caption,
    color: colors.text.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.tertiary,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  sessionNameMuted: {
    color: colors.text.tertiary,
  },
  sessionTime: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  tradeableBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  tradeableBadgeText: {
    ...typography.caption,
    color: colors.text.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  cycleDay: {
    borderLeftWidth: 3,
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  cycleDayName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  cycleDayDesc: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  cycleDayAction: {
    ...typography.caption,
    color: colors.semantic.info,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  pdArraySubtitle: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  pdArrayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  pdArrayRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.semantic.info,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdArrayRankText: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '700',
  },
  pdArrayInfo: {
    flex: 1,
  },
  pdArrayName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  pdArrayDesc: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  fibSectionTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  fibGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  fibItem: {
    alignItems: 'center',
  },
  fibLevel: {
    ...typography.title,
    color: colors.text.primary,
    fontWeight: '700',
  },
  fibLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 10,
  },
  riskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.tertiary,
  },
  riskLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  riskValue: {
    ...typography.body,
    color: colors.semantic.success,
    fontWeight: '600',
  },
  principle: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
});
