import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, typography, spacing, radii } from '../design/tokens';
import { WeeklyTemplateId, WeeklyTemplateCategory } from '../types/ict';
import { WEEKLY_TEMPLATES, TEMPLATE_CATEGORIES } from '../lib/ictProfiles';
import { useICTStore } from '../stores/ictStore';

const CATEGORY_ORDER: WeeklyTemplateCategory[] = ['classic', 'wednesday', 'consolidation', 'seek_destroy'];

const TEMPLATE_ORDER: WeeklyTemplateId[] = [
  'classic_tuesday_low',
  'classic_tuesday_high',
  'wednesday_low',
  'wednesday_high',
  'wednesday_reversal_bull',
  'wednesday_reversal_bear',
  'consolidation_thursday_bull',
  'consolidation_thursday_bear',
  'seek_destroy_friday_bull',
  'seek_destroy_friday_bear',
];

export function TemplateSelector() {
  const { activeTemplateId, weekStartDate, setWeekTemplate } = useICTStore();
  const [activeCategory, setActiveCategory] = useState<WeeklyTemplateCategory | 'all'>('all');

  const formatWeekRange = (startDate: string) => {
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(start);
    end.setDate(end.getDate() + 4);
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(start)} - ${fmt(end)}`;
  };

  const filteredTemplates = activeCategory === 'all'
    ? TEMPLATE_ORDER
    : TEMPLATE_ORDER.filter((id) => WEEKLY_TEMPLATES[id].category === activeCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Template</Text>
        <Text style={styles.weekRange}>{formatWeekRange(weekStartDate)}</Text>
      </View>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        <View style={styles.categoryRow}>
          <TouchableOpacity
            style={[styles.categoryTab, activeCategory === 'all' && styles.categoryTabActive]}
            onPress={() => setActiveCategory('all')}
          >
            <Text style={[styles.categoryText, activeCategory === 'all' && styles.categoryTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {CATEGORY_ORDER.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryTab, activeCategory === cat && styles.categoryTabActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
                {TEMPLATE_CATEGORIES[cat].label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Template Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.row}>
          {filteredTemplates.map((id) => {
            const template = WEEKLY_TEMPLATES[id];
            const isActive = activeTemplateId === id;
            const biasColor = template.bias === 'bullish' ? colors.semantic.success : colors.semantic.error;

            return (
              <TouchableOpacity
                key={id}
                style={[styles.chip, isActive && styles.chipActive, isActive && { borderColor: biasColor }]}
                onPress={() => setWeekTemplate(id)}
              >
                <View style={[styles.biasIndicator, { backgroundColor: biasColor }]} />
                <Text style={[styles.chipText, isActive && { color: biasColor }]} numberOfLines={1}>
                  {template.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {activeTemplateId && WEEKLY_TEMPLATES[activeTemplateId] && (
        <Text style={styles.description}>
          {WEEKLY_TEMPLATES[activeTemplateId].useCase}
        </Text>
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
  title: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  weekRange: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  categoryScroll: {
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  categoryTab: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.bg.tertiary,
  },
  categoryTabActive: {
    backgroundColor: colors.semantic.info + '30',
  },
  categoryText: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 11,
  },
  categoryTextActive: {
    color: colors.semantic.info,
    fontWeight: '600',
  },
  scroll: {
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingRight: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: colors.bg.tertiary,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: spacing.xs,
  },
  chipActive: {
    backgroundColor: colors.bg.primary,
  },
  biasIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chipText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  description: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});
