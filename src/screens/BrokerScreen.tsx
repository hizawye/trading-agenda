import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BrokerLoginModal } from '../components/BrokerLoginModal';
import { BrokerDashboard } from './BrokerDashboard';
import { matchTraderAPI } from '../lib/matchTraderAPI';
import { colors, typography, spacing, radii } from '../design/tokens';
import { ScreenLayout } from '../components/ScreenLayout';

export default function BrokerScreen() {
  const [connected, setConnected] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setLoading(true);
    const tokens = await matchTraderAPI.loadStoredTokens();
    setConnected(!!tokens);
    setLoading(false);
  };

  const handleLoginSuccess = () => {
    setConnected(true);
  };

  const handleLogout = () => {
    setConnected(false);
  };

  if (loading) {
    return (
      <ScreenLayout>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </ScreenLayout>
    );
  }

  if (connected) {
    return <BrokerDashboard onLogout={handleLogout} />;
  }

  return (
    <ScreenLayout>
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Connect Your Broker</Text>
        <Text style={styles.emptyDescription}>
          Connect your Maven Trading Match-Trader account to automatically sync trades, view live
          positions, and track your balance.
        </Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>View open positions with live P&L</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔄</Text>
            <Text style={styles.featureText}>Auto-import closed trades to journal</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>💰</Text>
            <Text style={styles.featureText}>Track account balance and equity</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.connectBtn} onPress={() => setLoginVisible(true)}>
          <Text style={styles.connectBtnText}>Connect Account</Text>
        </TouchableOpacity>

        <Text style={styles.securityNote}>
          🔒 Your credentials are stored securely on your device and never shared
        </Text>
      </View>

      <BrokerLoginModal
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
        onSuccess={handleLoginSuccess}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  emptyTitle: {
    ...typography.heading,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyDescription: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  features: {
    width: '100%',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bg.secondary,
    padding: spacing.md,
    borderRadius: radii.md,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  connectBtn: {
    backgroundColor: colors.semantic.success,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    marginTop: spacing.lg,
  },
  connectBtnText: {
    ...typography.body,
    color: colors.bg.primary,
    fontWeight: '600',
  },
  securityNote: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
