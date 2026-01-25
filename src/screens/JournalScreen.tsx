import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';
import { useTradeStore } from '../stores/tradeStore';
import { useRuleStore } from '../stores/ruleStore';
import { useAlertStore } from '../stores/alertStore';
import { Trade, Session, SetupType, TradeOutcome } from '../types';
import { getSessionById, getCurrentSession } from '../constants/sessions';
import { DEFAULT_KILLZONES } from '../constants/killzones';
import { calculateRiskReward, getNYTime } from '../lib/utils';
import { colors, typography, spacing } from '../design/tokens';
import { FormModal } from '../components/FormModal';
import { TradeCard } from '../components/TradeCard';
import { FAB } from '../components/FAB';
import { TradeDashboard } from '../components/TradeDashboard';
import { TradeFilters } from '../components/TradeFilters';
import { FilterStats } from '../components/FilterStats';
import { RulesReminder } from '../components/RulesReminder';
import { TradeForm } from '../components/TradeForm';
import { useTradeForm } from '../hooks/useTradeForm';

export default function JournalScreen() {
  const { trades, loadTrades, addTrade, updateTrade, deleteTrade, getTodayTrades, getTodayPnL, getTodayWinRate } = useTradeStore();
  const { rules, loadRules } = useRuleStore();
  const { loadAlerts, getNextAlert, initializeNotifications } = useAlertStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [showRules, setShowRules] = useState(true);
  const [currentTime, setCurrentTime] = useState(getNYTime());

  // Filters
  const [filterSession, setFilterSession] = useState<Session | 'all'>('all');
  const [filterSetup, setFilterSetup] = useState<SetupType | 'all'>('all');
  const [filterOutcome, setFilterOutcome] = useState<TradeOutcome | 'all'>('all');

  const { values, handlers, isValidQuick, isValidFull } = useTradeForm();

  // Dashboard data
  const currentSession = getCurrentSession();
  const nextAlert = getNextAlert();
  const todayStats = useMemo(() => ({
    tradeCount: getTodayTrades().length,
    pnl: getTodayPnL(),
    winRate: getTodayWinRate(),
  }), [trades]);

  useEffect(() => {
    loadTrades();
    loadRules();
    loadAlerts();
    initializeNotifications();

    const timer = setInterval(() => setCurrentTime(getNYTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Memoized filtered trades
  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      if (filterSession !== 'all' && trade.session !== filterSession) return false;
      if (filterSetup !== 'all' && trade.setupType !== filterSetup) return false;
      if (filterOutcome !== 'all' && trade.outcome !== filterOutcome) return false;
      return true;
    });
  }, [trades, filterSession, filterSetup, filterOutcome]);

  // Memoized filter stats
  const filterStats = useMemo(() => {
    const completed = filteredTrades.filter((t) => t.outcome !== 'pending');
    const wins = completed.filter((t) => t.outcome === 'win').length;
    const winRate = completed.length > 0 ? (wins / completed.length) * 100 : 0;
    const totalPnL = completed.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const avgRR = completed.length > 0
      ? completed.reduce((sum, t) => sum + (t.riskReward || 0), 0) / completed.length
      : 0;
    return { trades: filteredTrades.length, winRate, totalPnL, avgRR };
  }, [filteredTrades]);

  const hasActiveFilters = filterSession !== 'all' || filterSetup !== 'all' || filterOutcome !== 'all';

  const openAddModal = () => {
    handlers.resetForm();
    handlers.setQuickMode(true);
    setEditingTrade(null);
    setShowRules(true);
    setModalVisible(true);
  };

  const openEditModal = (trade: Trade) => {
    setEditingTrade(trade);
    handlers.loadTrade(trade);
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const entryNum = parseFloat(values.entry) || 0;
      const slNum = parseFloat(values.stopLoss) || 0;
      const tpNum = parseFloat(values.takeProfit) || 0;
      const rr = calculateRiskReward(entryNum, slNum, tpNum);

      let pnlValue: number | undefined = undefined;
      if (values.pnl) {
        const pnlNum = parseFloat(values.pnl);
        if (values.outcome === 'loss') {
          pnlValue = -Math.abs(pnlNum);
        } else if (values.outcome === 'win') {
          pnlValue = Math.abs(pnlNum);
        } else {
          pnlValue = pnlNum;
        }
      }

      const tradeData = {
        timestamp: Date.now(),
        session: values.session,
        timeWindow: values.timeWindow,
        killzone: values.killzone,
        setupType: values.setupType,
        direction: values.direction,
        symbol: values.symbol,
        entry: entryNum,
        stopLoss: slNum,
        takeProfit: tpNum,
        outcome: values.outcome,
        pnl: pnlValue,
        riskReward: rr,
        images: values.images,
        notes: values.notes,
        confirmations: values.confirmations,
      };

      if (editingTrade) {
        await updateTrade({ ...editingTrade, ...tradeData });
      } else {
        await addTrade(tradeData);
      }

      setModalVisible(false);
      handlers.resetForm();
    } catch (error) {
      console.error('Failed to save trade:', error);
      Alert.alert('Error', 'Failed to save trade. Please try again.');
    }
  };

  const handleDelete = () => {
    if (!editingTrade) return;
    Alert.alert('Delete Trade', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTrade(editingTrade.id);
          setModalVisible(false);
          handlers.resetForm();
        },
      },
    ]);
  };

  const saveDisabled = values.quickMode
    ? !isValidQuick
    : !isValidFull;

  return (
    <View style={styles.container}>
      <TradeDashboard
        currentSession={currentSession}
        currentTime={currentTime}
        nextAlert={nextAlert}
        todayStats={todayStats}
      />

      <TradeFilters
        filters={{ session: filterSession, setup: filterSetup, outcome: filterOutcome }}
        onSessionChange={setFilterSession}
        onSetupChange={setFilterSetup}
        onOutcomeChange={setFilterOutcome}
      />

      {hasActiveFilters && filteredTrades.length > 0 && (
        <FilterStats stats={filterStats} />
      )}

      <FlatList
        data={filteredTrades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TradeCard
            trade={item}
            session={getSessionById(item.session)}
            killzone={DEFAULT_KILLZONES.find((k) => k.id === item.killzone)}
            onPress={() => openEditModal(item)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No trades yet</Text>
            <Text style={styles.emptySubtext}>Tap + to add your first trade</Text>
          </View>
        }
      />

      <FAB onPress={openAddModal} />

      <FormModal
        visible={modalVisible}
        title={editingTrade ? 'Edit Trade' : (values.quickMode ? 'Quick Add' : 'New Trade')}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        onDelete={editingTrade ? handleDelete : undefined}
        saveDisabled={saveDisabled}
      >
        {!editingTrade && showRules && (
          <RulesReminder rules={rules} onDismiss={() => setShowRules(false)} />
        )}
        <TradeForm values={values} handlers={handlers} isEditing={!!editingTrade} />
      </FormModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  list: { padding: spacing.md },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { ...typography.body, color: colors.text.primary },
  emptySubtext: { ...typography.caption, marginTop: spacing.sm },
});
