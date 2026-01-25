import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Session, SetupType, TradeOutcome } from '../types';
import { SESSIONS } from '../constants/sessions';
import { colors, typography, spacing, radii } from '../design/tokens';

interface Filters {
  session: Session | 'all';
  setup: SetupType | 'all';
  outcome: TradeOutcome | 'all';
}

interface Props {
  filters: Filters;
  onSessionChange: (s: Session | 'all') => void;
  onSetupChange: (s: SetupType | 'all') => void;
  onOutcomeChange: (o: TradeOutcome | 'all') => void;
}

export function TradeFilters({ filters, onSessionChange, onSetupChange, onOutcomeChange }: Props) {
  return (
    <View style={styles.filterBar}>
      <TouchableOpacity
        style={[styles.filterChip, filters.session !== 'all' && styles.filterChipActive]}
        onPress={() => onSessionChange(filters.session === 'all' ? SESSIONS[0].id : 'all')}
      >
        <Text style={[styles.filterChipText, filters.session !== 'all' && styles.filterChipTextActive]}>
          {filters.session === 'all' ? 'All Sessions' : SESSIONS.find(s => s.id === filters.session)?.name}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.filterChip, filters.setup !== 'all' && styles.filterChipActive]}
        onPress={() => onSetupChange(filters.setup === 'all' ? 'continuation' : 'all')}
      >
        <Text style={[styles.filterChipText, filters.setup !== 'all' && styles.filterChipTextActive]}>
          {filters.setup === 'all' ? 'All Setups' : filters.setup.replace('_', ' ')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.filterChip, filters.outcome !== 'all' && styles.filterChipActive]}
        onPress={() => onOutcomeChange(filters.outcome === 'all' ? 'win' : 'all')}
      >
        <Text style={[styles.filterChipText, filters.outcome !== 'all' && styles.filterChipTextActive]}>
          {filters.outcome === 'all' ? 'All Outcomes' : filters.outcome.toUpperCase()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    padding: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.bg.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.tertiary,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.text.tertiary,
  },
  filterChipActive: {
    backgroundColor: colors.semantic.success,
    borderColor: colors.semantic.success,
  },
  filterChipText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  filterChipTextActive: {
    color: '#FFF',
  },
});
