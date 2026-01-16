import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../design/tokens';

interface Option<T> {
  value: T;
  label: string;
  color?: string;
}

interface OptionPickerProps<T> {
  options: Option<T>[];
  selected: T | T[];
  onSelect: (value: T) => void;
  multiple?: boolean;
}

export function OptionPicker<T extends string>({
  options,
  selected,
  onSelect,
  multiple = false,
}: OptionPickerProps<T>) {
  const isSelected = (value: T): boolean => {
    if (multiple && Array.isArray(selected)) {
      return selected.includes(value);
    }
    return selected === value;
  };

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const active = isSelected(option.value);
        const bgColor = active
          ? option.color || colors.semantic.success
          : colors.bg.tertiary;

        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.option, { backgroundColor: bgColor }]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  labelActive: {
    color: '#FFF',
  },
});
