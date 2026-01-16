import React, { ReactNode } from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../design/tokens';

interface ScreenLayoutProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
}

export function ScreenLayout({ children, scrollable = true, style }: ScreenLayoutProps) {
  if (scrollable) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, style]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.container, styles.content, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
