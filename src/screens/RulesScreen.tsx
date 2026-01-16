import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRuleStore } from '../stores/ruleStore';
import { Rule, RuleCategory } from '../types';
import { RULE_CATEGORIES } from '../constants/defaultRules';
import { colors, typography, spacing, radii } from '../design/tokens';
import { FormModal } from '../components/FormModal';
import { FormField, FormLabel } from '../components/FormField';
import { OptionPicker } from '../components/OptionPicker';
import { FAB } from '../components/FAB';

export default function RulesScreen() {
  const { loadRules, addRule, updateRule, toggleRule, deleteRule, getRulesByCategory } = useRuleStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<RuleCategory | null>('timing');

  const [category, setCategory] = useState<RuleCategory>('timing');
  const [ruleText, setRuleText] = useState('');

  useEffect(() => {
    loadRules();
  }, []);

  const resetForm = () => {
    setCategory('timing');
    setRuleText('');
    setEditingRule(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (rule: Rule) => {
    setEditingRule(rule);
    setCategory(rule.category);
    setRuleText(rule.rule);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!ruleText.trim()) return;

    const categoryRules = getRulesByCategory(category);
    const order = categoryRules.length + 1;

    if (editingRule) {
      await updateRule({ ...editingRule, category, rule: ruleText });
    } else {
      await addRule({ category, rule: ruleText, active: true, order });
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDelete = () => {
    if (editingRule) {
      deleteRule(editingRule.id);
      setModalVisible(false);
      resetForm();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {RULE_CATEGORIES.map((cat) => {
          const categoryRules = getRulesByCategory(cat.id);
          const isExpanded = expandedCategory === cat.id;

          return (
            <View key={cat.id} style={styles.categorySection}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => setExpandedCategory(isExpanded ? null : cat.id)}
              >
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                  <Text style={styles.categoryTitle}>{cat.label}</Text>
                  <Text style={styles.categoryCount}>({categoryRules.length})</Text>
                </View>
                <Text style={styles.expandIcon}>{isExpanded ? '−' : '+'}</Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.rulesList}>
                  {categoryRules.map((rule) => (
                    <TouchableOpacity
                      key={rule.id}
                      style={[styles.ruleItem, !rule.active && styles.ruleInactive]}
                      onPress={() => openEditModal(rule)}
                      onLongPress={() => toggleRule(rule.id)}
                    >
                      <View style={[styles.ruleCheck, rule.active && styles.ruleCheckActive]}>
                        {rule.active && <Text style={styles.checkMark}>✓</Text>}
                      </View>
                      <Text style={[styles.ruleText, !rule.active && styles.ruleTextInactive]}>
                        {rule.rule}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {categoryRules.length === 0 && (
                    <Text style={styles.emptyText}>No rules in this category</Text>
                  )}
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      <FAB onPress={openAddModal} />

      <FormModal
        visible={modalVisible}
        title={editingRule ? 'Edit Rule' : 'New Rule'}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        onDelete={editingRule ? handleDelete : undefined}
      >
        <FormLabel>Category</FormLabel>
        <OptionPicker
          options={RULE_CATEGORIES.map((cat) => ({ value: cat.id, label: cat.label, color: cat.color }))}
          selected={category}
          onSelect={setCategory}
        />

        <FormField
          label="Rule"
          value={ruleText}
          onChangeText={setRuleText}
          placeholder="Enter your trading rule..."
          multiline
        />
      </FormModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scrollView: { flex: 1, padding: spacing.md },
  categorySection: {
    marginBottom: spacing.md,
    backgroundColor: colors.bg.secondary,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  categoryLeft: { flexDirection: 'row', alignItems: 'center' },
  categoryDot: { width: 12, height: 12, borderRadius: 6, marginRight: spacing.sm },
  categoryTitle: { ...typography.body, fontWeight: '600' },
  categoryCount: { ...typography.body, color: colors.text.tertiary, marginLeft: spacing.sm },
  expandIcon: { color: colors.text.tertiary, fontSize: 24 },
  rulesList: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.tertiary,
  },
  ruleInactive: { opacity: 0.5 },
  ruleCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.text.tertiary,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleCheckActive: { backgroundColor: colors.semantic.success, borderColor: colors.semantic.success },
  checkMark: { color: '#FFF', fontSize: 14 },
  ruleText: { ...typography.body, flex: 1, lineHeight: 22 },
  ruleTextInactive: { color: colors.text.tertiary, textDecorationLine: 'line-through' },
  emptyText: { ...typography.caption, fontStyle: 'italic' },
});
