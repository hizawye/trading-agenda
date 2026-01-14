import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { useRuleStore } from '../stores/ruleStore';
import { Rule, RuleCategory } from '../types';
import { RULE_CATEGORIES } from '../constants/defaultRules';

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

      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{editingRule ? 'Edit Rule' : 'New Rule'}</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveBtn}>Save</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryPicker}>
            {RULE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryOption, category === cat.id && { backgroundColor: cat.color }]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={styles.categoryOptionText}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Rule</Text>
          <TextInput
            style={[styles.input, styles.ruleInput]}
            value={ruleText}
            onChangeText={setRuleText}
            placeholder="Enter your trading rule..."
            placeholderTextColor="#64748B"
            multiline
          />

          {editingRule && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                deleteRule(editingRule.id);
                setModalVisible(false);
              }}
            >
              <Text style={styles.deleteText}>Delete Rule</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scrollView: { flex: 1, padding: 16 },
  categorySection: {
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryLeft: { flexDirection: 'row', alignItems: 'center' },
  categoryDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  categoryTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: '600' },
  categoryCount: { color: '#64748B', fontSize: 16, marginLeft: 8 },
  expandIcon: { color: '#64748B', fontSize: 24 },
  rulesList: { paddingHorizontal: 16, paddingBottom: 16 },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  ruleInactive: { opacity: 0.5 },
  ruleCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#475569',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleCheckActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  checkMark: { color: '#FFF', fontSize: 14 },
  ruleText: { color: '#F1F5F9', fontSize: 15, flex: 1, lineHeight: 22 },
  ruleTextInactive: { color: '#64748B', textDecorationLine: 'line-through' },
  emptyText: { color: '#64748B', fontStyle: 'italic' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: { color: '#FFF', fontSize: 32, marginTop: -2 },

  modal: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  cancelBtn: { color: '#EF4444', fontSize: 16 },
  saveBtn: { color: '#10B981', fontSize: 16, fontWeight: '600' },
  modalTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: '600' },
  label: { color: '#94A3B8', fontSize: 14, marginBottom: 8, marginTop: 16 },
  categoryPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#334155',
    borderRadius: 8,
  },
  categoryOptionText: { color: '#FFF', fontSize: 14 },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 14,
    color: '#F1F5F9',
    fontSize: 16,
  },
  ruleInput: { height: 120, textAlignVertical: 'top' },
  deleteBtn: {
    backgroundColor: '#7F1D1D',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  deleteText: { color: '#FCA5A5', fontSize: 16 },
});
