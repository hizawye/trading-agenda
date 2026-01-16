import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Paths, File as ExpoFile } from 'expo-file-system';
import { useTradeStore } from '../stores/tradeStore';
import { Trade, Session, SetupType, TradeDirection, TradeOutcome, Confirmation, Killzone } from '../types';
import { getSessionById, getCurrentSession } from '../constants/sessions';
import { DEFAULT_KILLZONES, getCurrentKillzone } from '../constants/killzones';
import { calculateRiskReward } from '../lib/utils';
import { colors, typography, spacing, radii } from '../design/tokens';
import { outcomeColor } from '../design/utils';
import { FormModal } from '../components/FormModal';
import { FormField, FormLabel } from '../components/FormField';
import { OptionPicker } from '../components/OptionPicker';
import { TradeCard } from '../components/TradeCard';
import { FAB } from '../components/FAB';

const SETUP_TYPES: SetupType[] = ['continuation', 'reversal', 'liquidity_sweep', 'fvg_fill', 'breakout', 'other'];
const CONFIRMATIONS: Confirmation[] = ['smt', 'mss', 'bos', 'fvg', 'swing_sweep', 'pd_array', 'time_window'];
const OUTCOMES: TradeOutcome[] = ['win', 'loss', 'breakeven', 'pending'];

export default function JournalScreen() {
  const { trades, loadTrades, addTrade, updateTrade, deleteTrade } = useTradeStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  // Form state
  const [session, setSession] = useState<Session>('ny_am');
  const [timeWindow, setTimeWindow] = useState('');
  const [killzone, setKillzone] = useState<Killzone>('ny_am_kz');
  const [setupType, setSetupType] = useState<SetupType>('continuation');
  const [direction, setDirection] = useState<TradeDirection>('long');
  const [symbol, setSymbol] = useState('');
  const [entry, setEntry] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [outcome, setOutcome] = useState<TradeOutcome>('pending');
  const [pnl, setPnl] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmations, setConfirmations] = useState<Confirmation[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [quickMode, setQuickMode] = useState(true); // Quick vs full form mode

  useEffect(() => {
    loadTrades();
  }, []);

  const resetForm = () => {
    const current = getCurrentSession();
    const currentKz = getCurrentKillzone();
    setSession(current?.id || 'ny_am');
    setKillzone(currentKz?.id || 'ny_am_kz');
    setTimeWindow('');
    setSetupType('continuation');
    setDirection('long');
    setSymbol('');
    setEntry('');
    setStopLoss('');
    setTakeProfit('');
    setOutcome('pending');
    setPnl('');
    setNotes('');
    setConfirmations([]);
    setImages([]);
    setEditingTrade(null);
    setQuickMode(true);
  };

  const openAddModal = () => {
    resetForm();
    setQuickMode(true); // New trades default to quick mode
    setModalVisible(true);
  };

  const openEditModal = (trade: Trade) => {
    setEditingTrade(trade);
    setSession(trade.session);
    setTimeWindow(trade.timeWindow);
    setKillzone(trade.killzone || 'ny_am_kz');
    setSetupType(trade.setupType);
    setDirection(trade.direction);
    setSymbol(trade.symbol);
    setEntry(trade.entry.toString());
    setStopLoss(trade.stopLoss.toString());
    setTakeProfit(trade.takeProfit.toString());
    setOutcome(trade.outcome);
    setPnl(trade.pnl?.toString() || '');
    setNotes(trade.notes);
    setConfirmations(trade.confirmations);
    setImages(trade.images || []);
    setQuickMode(false); // Editing shows full form
    setModalVisible(true);
  };

  const handleSave = async () => {
    const entryNum = parseFloat(entry) || 0;
    const slNum = parseFloat(stopLoss) || 0;
    const tpNum = parseFloat(takeProfit) || 0;
    const rr = calculateRiskReward(entryNum, slNum, tpNum);

    const tradeData = {
      timestamp: Date.now(),
      session,
      timeWindow,
      killzone,
      setupType,
      direction,
      symbol,
      entry: entryNum,
      stopLoss: slNum,
      takeProfit: tpNum,
      outcome,
      pnl: pnl ? parseFloat(pnl) : undefined,
      riskReward: rr,
      images,
      notes,
      confirmations,
    };

    if (editingTrade) {
      await updateTrade({ ...editingTrade, ...tradeData });
    } else {
      await addTrade(tradeData);
    }

    setModalVisible(false);
    resetForm();
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
          resetForm();
        },
      },
    ]);
  };

  const toggleConfirmation = (c: Confirmation) => {
    setConfirmations((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      const filename = `trade_${Date.now()}.jpg`;
      try {
        const sourceFile = new ExpoFile(uri);
        const destFile = new ExpoFile(Paths.document, filename);
        await sourceFile.copy(destFile);
        setImages((prev) => [...prev, destFile.uri]);
      } catch {
        setImages((prev) => [...prev, uri]);
      }
    }
  };

  const removeImage = (uri: string) => {
    Alert.alert('Remove Image', 'Remove this screenshot?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setImages((prev) => prev.filter((img) => img !== uri)) },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={trades}
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
        title={editingTrade ? 'Edit Trade' : (quickMode ? 'Quick Add' : 'New Trade')}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        onDelete={editingTrade ? handleDelete : undefined}
      >
        {quickMode && !editingTrade ? (
          <>
            {/* Quick Mode: Essential fields only */}
            <FormField label="Symbol" value={symbol} onChangeText={setSymbol} placeholder="ES, NQ, BTC..." />

            <FormLabel>Direction</FormLabel>
            <OptionPicker
              options={[
                { value: 'long' as TradeDirection, label: 'LONG', color: colors.semantic.success },
                { value: 'short' as TradeDirection, label: 'SHORT', color: colors.semantic.error },
              ]}
              selected={direction}
              onSelect={setDirection}
            />

            <FormLabel>Outcome</FormLabel>
            <OptionPicker
              options={OUTCOMES.map((o) => ({ value: o, label: o.toUpperCase(), color: outcomeColor(o) }))}
              selected={outcome}
              onSelect={setOutcome}
            />

            <FormField label="P&L" value={pnl} onChangeText={setPnl} keyboardType="decimal-pad" placeholder="0.00" />

            <TouchableOpacity style={styles.moreDetailsBtn} onPress={() => setQuickMode(false)}>
              <Text style={styles.moreDetailsText}>+ More Details</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Full Mode: All fields */}
            {!editingTrade && (
              <TouchableOpacity style={styles.quickModeBtn} onPress={() => setQuickMode(true)}>
                <Text style={styles.quickModeText}>← Quick Add</Text>
              </TouchableOpacity>
            )}

            <FormLabel>Killzone</FormLabel>
            <OptionPicker
              options={DEFAULT_KILLZONES.map((kz) => ({ value: kz.id, label: kz.name, color: kz.color }))}
              selected={killzone}
              onSelect={(kz) => {
                setKillzone(kz);
                const kzInfo = DEFAULT_KILLZONES.find((k) => k.id === kz);
                if (kzInfo) setSession(kzInfo.session);
              }}
            />

            <FormLabel>Direction</FormLabel>
            <OptionPicker
              options={[
                { value: 'long' as TradeDirection, label: 'LONG', color: colors.semantic.success },
                { value: 'short' as TradeDirection, label: 'SHORT', color: colors.semantic.error },
              ]}
              selected={direction}
              onSelect={setDirection}
            />

            <FormLabel>Setup Type</FormLabel>
            <OptionPicker
              options={SETUP_TYPES.map((s) => ({ value: s, label: s.replace('_', ' ') }))}
              selected={setupType}
              onSelect={setSetupType}
            />

            <FormLabel>Confirmations</FormLabel>
            <OptionPicker
              options={CONFIRMATIONS.map((c) => ({ value: c, label: c.toUpperCase() }))}
              selected={confirmations}
              onSelect={toggleConfirmation}
              multiple
            />

            <FormField label="Symbol" value={symbol} onChangeText={setSymbol} placeholder="ES, NQ, BTC..." />

            <View style={styles.priceRow}>
              <View style={styles.priceField}>
                <FormField label="Entry" value={entry} onChangeText={setEntry} keyboardType="decimal-pad" placeholder="0.00" />
              </View>
              <View style={styles.priceField}>
                <FormField label="Stop Loss" value={stopLoss} onChangeText={setStopLoss} keyboardType="decimal-pad" placeholder="0.00" />
              </View>
              <View style={styles.priceField}>
                <FormField label="Take Profit" value={takeProfit} onChangeText={setTakeProfit} keyboardType="decimal-pad" placeholder="0.00" />
              </View>
            </View>

            <FormLabel>Outcome</FormLabel>
            <OptionPicker
              options={OUTCOMES.map((o) => ({ value: o, label: o.toUpperCase(), color: outcomeColor(o) }))}
              selected={outcome}
              onSelect={setOutcome}
            />

            <FormField label="P&L (optional)" value={pnl} onChangeText={setPnl} keyboardType="decimal-pad" placeholder="0.00" />

            <FormField label="Notes" value={notes} onChangeText={setNotes} placeholder="Trade notes..." multiline />

            <FormLabel>Screenshots</FormLabel>
            <View style={styles.imagesContainer}>
              {images.map((uri, index) => (
                <TouchableOpacity key={index} onPress={() => removeImage(uri)} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.thumbnail} />
                  <View style={styles.removeImageBadge}>
                    <Text style={styles.removeImageText}>×</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
                <Text style={styles.addImageText}>+</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
  priceRow: { flexDirection: 'row', gap: spacing.sm },
  priceField: { flex: 1 },
  imagesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  imageWrapper: { position: 'relative' },
  thumbnail: { width: 80, height: 80, borderRadius: radii.sm, backgroundColor: colors.bg.tertiary },
  removeImageBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.semantic.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginTop: -2 },
  addImageBtn: {
    width: 80,
    height: 80,
    borderRadius: radii.sm,
    backgroundColor: colors.bg.tertiary,
    borderWidth: 2,
    borderColor: colors.text.tertiary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: { color: colors.text.secondary, fontSize: 28 },
  moreDetailsBtn: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  moreDetailsText: {
    ...typography.body,
    color: colors.semantic.success,
    fontWeight: '600',
  },
  quickModeBtn: {
    marginBottom: spacing.sm,
    padding: spacing.sm,
    alignItems: 'flex-start',
  },
  quickModeText: {
    ...typography.caption,
    color: colors.semantic.success,
    fontWeight: '600',
  },
});
