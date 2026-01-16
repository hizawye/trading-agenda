import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { matchTraderAPI } from '../lib/matchTraderAPI';
import { useTradeStore } from '../stores/tradeStore';
import type { BrokerPosition, BrokerClosedTrade, BrokerBalance } from '../types/broker';
import { colors, typography, spacing, radii } from '../design/tokens';

interface BrokerDashboardProps {
  onLogout: () => void;
}

export function BrokerDashboard({ onLogout }: BrokerDashboardProps) {
  const [balance, setBalance] = useState<BrokerBalance | null>(null);
  const [positions, setPositions] = useState<BrokerPosition[]>([]);
  const [closedTrades, setClosedTrades] = useState<BrokerClosedTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const addTrade = useTradeStore((state) => state.addTrade);

  useEffect(() => {
    loadData();
    loadEmail();
  }, []);

  const loadEmail = async () => {
    const storedEmail = await matchTraderAPI.getStoredEmail();
    setEmail(storedEmail);
  };

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [balanceData, positionsData, closedData] = await Promise.all([
        matchTraderAPI.getBalance(),
        matchTraderAPI.getOpenPositions(),
        matchTraderAPI.getClosedPositions(50),
      ]);

      setBalance(balanceData);
      setPositions(positionsData);
      setClosedTrades(closedData);
    } catch (error: any) {
      // Only show error if it's a critical auth issue
      if (error.message?.includes('Session expired') || error.message?.includes('Not authenticated')) {
        Alert.alert('Session Expired', 'Please log in again');
        onLogout();
      } else {
        // Just log other errors, don't alert user
        console.error('Failed to load broker data:', error.message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSyncTrade = async (trade: BrokerClosedTrade) => {
    try {
      // Check if already imported
      const existingTrades = useTradeStore.getState().trades;
      const alreadyImported = existingTrades.some(
        (t) => t.notes?.includes(`Broker ID: ${trade.id}`)
      );

      if (alreadyImported) {
        Alert.alert('Already Imported', 'This trade is already in your journal');
        return;
      }

      // Import to journal
      const tradeDate = new Date(trade.closeTime);
      await addTrade({
        timestamp: tradeDate.getTime(),
        session: 'ny_am', // Default, user can edit later
        timeWindow: '', // Deprecated
        setupType: 'other',
        direction: trade.type === 'buy' ? 'long' : 'short',
        symbol: trade.symbol,
        entry: trade.openPrice,
        stopLoss: trade.openPrice, // Placeholder
        takeProfit: trade.closePrice,
        outcome: trade.profit >= 0 ? 'win' : 'loss',
        pnl: trade.profit,
        riskReward: Math.abs(trade.profit / (trade.volume * 100)),
        images: [],
        notes: `Auto-imported from broker\nBroker ID: ${trade.id}\nVolume: ${trade.volume}\nCommission: ${trade.commission || 0}\nSwap: ${trade.swap || 0}`,
        confirmations: [],
      });

      Alert.alert('Success', 'Trade imported to journal');
    } catch (error: any) {
      Alert.alert('Import Failed', error.message);
    }
  };

  const handleLogout = () => {
    Alert.alert('Disconnect Broker', 'Are you sure you want to disconnect?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Disconnect',
        style: 'destructive',
        onPress: async () => {
          await matchTraderAPI.logout();
          onLogout();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.semantic.success} />
          <Text style={styles.loadingText}>Loading broker data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Broker Account</Text>
          {email && <Text style={styles.headerSubtitle}>{email}</Text>}
        </View>
        <TouchableOpacity onPress={handleLogout} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.logoutBtn}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />}
      >
        {/* Balance Card */}
        {balance && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account Balance</Text>
            <View style={styles.balanceGrid}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Balance</Text>
                <Text style={styles.balanceValue}>${balance.balance.toFixed(2)}</Text>
              </View>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Equity</Text>
                <Text style={[styles.balanceValue, { color: colors.semantic.success }]}>
                  ${balance.equity.toFixed(2)}
                </Text>
              </View>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Free Margin</Text>
                <Text style={styles.balanceValue}>${balance.freeMargin.toFixed(2)}</Text>
              </View>
              {balance.marginLevel !== undefined && (
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceLabel}>Margin Level</Text>
                  <Text style={styles.balanceValue}>{balance.marginLevel.toFixed(0)}%</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Open Positions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Open Positions ({positions.length})</Text>
          {positions.length === 0 ? (
            <Text style={styles.emptyText}>No open positions</Text>
          ) : (
            positions.map((pos) => (
              <View key={pos.id} style={styles.positionItem}>
                <View style={styles.positionHeader}>
                  <Text style={styles.positionSymbol}>{pos.symbol}</Text>
                  <Text style={[styles.positionType, pos.type === 'buy' ? styles.buyType : styles.sellType]}>
                    {pos.type.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.positionDetails}>
                  <Text style={styles.positionText}>Vol: {pos.volume}</Text>
                  <Text style={styles.positionText}>Entry: {pos.openPrice.toFixed(5)}</Text>
                  <Text style={styles.positionText}>Current: {pos.currentPrice.toFixed(5)}</Text>
                  <Text style={[styles.positionProfit, pos.profit >= 0 ? styles.profitPositive : styles.profitNegative]}>
                    {pos.profit >= 0 ? '+' : ''}${pos.profit.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Closed Trades */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Closed Trades</Text>
          {closedTrades.length === 0 ? (
            <Text style={styles.emptyText}>No closed trades</Text>
          ) : (
            closedTrades.slice(0, 20).map((trade) => (
              <View key={trade.id} style={styles.tradeItem}>
                <View style={styles.tradeHeader}>
                  <View style={styles.tradeInfo}>
                    <Text style={styles.tradeSymbol}>{trade.symbol}</Text>
                    <Text style={[styles.tradeType, trade.type === 'buy' ? styles.buyType : styles.sellType]}>
                      {trade.type.toUpperCase()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.importBtn}
                    onPress={() => handleSyncTrade(trade)}
                  >
                    <Text style={styles.importBtnText}>Import</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.tradeDetails}>
                  <Text style={styles.tradeText}>
                    {new Date(trade.closeTime).toLocaleDateString()}
                  </Text>
                  <Text style={styles.tradeText}>Vol: {trade.volume}</Text>
                  <Text style={[styles.tradeProfit, trade.profit >= 0 ? styles.profitPositive : styles.profitNegative]}>
                    {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.tertiary,
  },
  headerTitle: {
    ...typography.title,
    fontWeight: '600',
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  logoutBtn: {
    ...typography.body,
    color: colors.semantic.error,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.bg.secondary,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    gap: spacing.md,
  },
  cardTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  balanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  balanceItem: {
    flex: 1,
    minWidth: '45%',
    gap: spacing.xs,
  },
  balanceLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  balanceValue: {
    ...typography.title,
    fontWeight: '600',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  positionItem: {
    padding: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radii.md,
    gap: spacing.xs,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  positionSymbol: {
    ...typography.body,
    fontWeight: '600',
  },
  positionType: {
    ...typography.caption,
    fontWeight: '600',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  buyType: {
    color: colors.semantic.success,
    backgroundColor: `${colors.semantic.success}20`,
  },
  sellType: {
    color: colors.semantic.error,
    backgroundColor: `${colors.semantic.error}20`,
  },
  positionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  positionText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  positionProfit: {
    ...typography.body,
    fontWeight: '600',
  },
  profitPositive: {
    color: colors.semantic.success,
  },
  profitNegative: {
    color: colors.semantic.error,
  },
  tradeItem: {
    padding: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radii.md,
    gap: spacing.xs,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tradeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tradeSymbol: {
    ...typography.body,
    fontWeight: '600',
  },
  tradeType: {
    ...typography.caption,
    fontWeight: '600',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  importBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.semantic.success,
    borderRadius: radii.sm,
  },
  importBtnText: {
    ...typography.caption,
    color: colors.bg.primary,
    fontWeight: '600',
  },
  tradeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  tradeText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  tradeProfit: {
    ...typography.body,
    fontWeight: '600',
  },
});
