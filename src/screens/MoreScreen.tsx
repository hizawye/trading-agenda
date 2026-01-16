import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, typography, spacing, radii } from '../design/tokens';

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
}

const MenuItem = ({ icon, title, subtitle, onPress, destructive }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <View>
        <Text style={[styles.menuTitle, destructive && styles.destructiveText]}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Text style={styles.chevron}>›</Text>
  </TouchableOpacity>
);

export default function MoreScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <MenuItem
          icon="📊"
          title="Analytics"
          subtitle="Performance & statistics"
          onPress={() => navigation.navigate('Analytics')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuration</Text>
        <MenuItem
          icon="📋"
          title="Rules"
          subtitle="Trading rules & checklist"
          onPress={() => navigation.navigate('Rules')}
        />
        <MenuItem
          icon="⏰"
          title="Alerts"
          subtitle="Session & killzone notifications"
          onPress={() => navigation.navigate('Alerts')}
        />
        <MenuItem
          icon="⚙️"
          title="Settings"
          subtitle="Session times & preferences"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Trading Agenda v1.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  content: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.caption,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bg.secondary,
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.xs,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  menuSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: colors.text.tertiary,
  },
  destructiveText: {
    color: colors.semantic.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});
