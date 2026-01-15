import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Paths, File as ExpoFile } from 'expo-file-system';
import { useTradeStore } from '../stores/tradeStore';
import { Trade, Session, SetupType, TradeDirection, TradeOutcome, Confirmation, Killzone } from '../types';
import { getSessionById, getCurrentSession, SESSIONS } from '../constants/sessions';
import { DEFAULT_KILLZONES, getCurrentKillzone } from '../constants/killzones';
import { formatDateTime, calculateRiskReward } from '../lib/utils';

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

  useEffect(() => {
    loadTrades();
  }, []);

  const resetForm = () => {
    const current = getCurrentSession();
    const currentKz = getCurrentKillzone();

    setSession(current?.id || 'ny_am');
    setKillzone(currentKz?.id || 'ny_am_kz');
    setTimeWindow(''); // Keep for backward compat
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
  };

  const openAddModal = () => {
    resetForm();
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
      timeWindow, // Keep for backward compat
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

  const handleDelete = (id: string) => {
    Alert.alert('Delete Trade', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTrade(id) },
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
      // Copy to app's document directory for persistence
      const filename = `trade_${Date.now()}.jpg`;

      try {
        const sourceFile = new ExpoFile(uri);
        const destFile = new ExpoFile(Paths.document, filename);
        await sourceFile.copy(destFile);
        setImages((prev) => [...prev, destFile.uri]);
      } catch {
        // Fallback to using original URI if copy fails
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

  const renderTrade = ({ item }: { item: Trade }) => {
    const sessionInfo = getSessionById(item.session);
    return (
      <TouchableOpacity style={styles.tradeCard} onPress={() => openEditModal(item)}>
        <View style={styles.tradeHeader}>
          <View style={[styles.sessionBadge, { backgroundColor: sessionInfo?.color || '#64748B' }]}>
            <Text style={styles.sessionText}>{sessionInfo?.name || item.session}</Text>
          </View>
          <Text style={[styles.direction, { color: item.direction === 'long' ? '#10B981' : '#EF4444' }]}>
            {item.direction.toUpperCase()}
          </Text>
          <View style={[styles.outcomeBadge, { backgroundColor: getOutcomeColor(item.outcome) }]}>
            <Text style={styles.outcomeText}>{item.outcome}</Text>
          </View>
        </View>

        <View style={styles.tradeBody}>
          <Text style={styles.symbol}>{item.symbol || 'No symbol'}</Text>
          <Text style={styles.setup}>{item.setupType.replace('_', ' ')}</Text>
          <Text style={styles.time}>{formatDateTime(item.timestamp)}</Text>
        </View>

        {item.pnl !== undefined && (
          <Text style={[styles.pnl, { color: item.pnl >= 0 ? '#10B981' : '#EF4444' }]}>
            {item.pnl >= 0 ? '+' : ''}{item.pnl.toFixed(2)}
          </Text>
        )}

        {item.confirmations.length > 0 && (
          <View style={styles.confirmations}>
            {item.confirmations.map((c) => (
              <View key={c} style={styles.confirmBadge}>
                <Text style={styles.confirmText}>{c.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={trades}
        keyExtractor={(item) => item.id}
        renderItem={renderTrade}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No trades yet</Text>
            <Text style={styles.emptySubtext}>Tap + to add your first trade</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <ScrollView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{editingTrade ? 'Edit Trade' : 'New Trade'}</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveBtn}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Session */}
          <Text style={styles.label}>Session</Text>
          <View style={styles.optionRow}>
            {SESSIONS.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.option, session === s.id && { backgroundColor: s.color }]}
                onPress={() => setSession(s.id)}
              >
                <Text style={styles.optionText}>{s.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Killzone */}
          <Text style={styles.label}>Killzone</Text>
          <View style={styles.optionRow}>
            {DEFAULT_KILLZONES.map((kz) => (
              <TouchableOpacity
                key={kz.id}
                style={[
                  styles.killzoneOption,
                  killzone === kz.id && { backgroundColor: kz.color, borderColor: kz.color },
                ]}
                onPress={() => {
                  setKillzone(kz.id);
                  // Auto-set session based on killzone
                  setSession(kz.session);
                }}
              >
                <Text style={[styles.optionText, styles.killzoneText]}>{kz.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Direction */}
          <Text style={styles.label}>Direction</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[styles.option, direction === 'long' && styles.longOption]}
              onPress={() => setDirection('long')}
            >
              <Text style={styles.optionText}>LONG</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, direction === 'short' && styles.shortOption]}
              onPress={() => setDirection('short')}
            >
              <Text style={styles.optionText}>SHORT</Text>
            </TouchableOpacity>
          </View>

          {/* Setup Type */}
          <Text style={styles.label}>Setup Type</Text>
          <View style={styles.optionRow}>
            {SETUP_TYPES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.option, setupType === s && styles.selectedOption]}
                onPress={() => setSetupType(s)}
              >
                <Text style={styles.optionText}>{s.replace('_', ' ')}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Confirmations */}
          <Text style={styles.label}>Confirmations</Text>
          <View style={styles.optionRow}>
            {CONFIRMATIONS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.option, confirmations.includes(c) && styles.selectedOption]}
                onPress={() => toggleConfirmation(c)}
              >
                <Text style={styles.optionText}>{c.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Symbol */}
          <Text style={styles.label}>Symbol</Text>
          <TextInput
            style={styles.input}
            value={symbol}
            onChangeText={setSymbol}
            placeholder="ES, NQ, BTC..."
            placeholderTextColor="#64748B"
          />

          {/* Prices */}
          <View style={styles.priceRow}>
            <View style={styles.priceField}>
              <Text style={styles.label}>Entry</Text>
              <TextInput
                style={styles.input}
                value={entry}
                onChangeText={setEntry}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#64748B"
              />
            </View>
            <View style={styles.priceField}>
              <Text style={styles.label}>Stop Loss</Text>
              <TextInput
                style={styles.input}
                value={stopLoss}
                onChangeText={setStopLoss}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#64748B"
              />
            </View>
            <View style={styles.priceField}>
              <Text style={styles.label}>Take Profit</Text>
              <TextInput
                style={styles.input}
                value={takeProfit}
                onChangeText={setTakeProfit}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>

          {/* Outcome */}
          <Text style={styles.label}>Outcome</Text>
          <View style={styles.optionRow}>
            {OUTCOMES.map((o) => (
              <TouchableOpacity
                key={o}
                style={[styles.option, outcome === o && { backgroundColor: getOutcomeColor(o) }]}
                onPress={() => setOutcome(o)}
              >
                <Text style={styles.optionText}>{o}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* P&L */}
          <Text style={styles.label}>P&L (optional)</Text>
          <TextInput
            style={styles.input}
            value={pnl}
            onChangeText={setPnl}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor="#64748B"
          />

          {/* Notes */}
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Trade notes..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={4}
          />

          {/* Screenshots */}
          <Text style={styles.label}>Screenshots</Text>
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
              <Text style={styles.addImageLabel}>Add</Text>
            </TouchableOpacity>
          </View>

          {editingTrade && (
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(editingTrade.id)}>
              <Text style={styles.deleteText}>Delete Trade</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 50 }} />
        </ScrollView>
      </Modal>
    </View>
  );
}

const getOutcomeColor = (outcome: TradeOutcome) => {
  switch (outcome) {
    case 'win': return '#10B981';
    case 'loss': return '#EF4444';
    case 'breakeven': return '#F59E0B';
    default: return '#64748B';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  list: { padding: 16 },
  tradeCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  sessionText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  direction: { fontSize: 14, fontWeight: 'bold', marginRight: 8 },
  outcomeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  outcomeText: { color: '#FFF', fontSize: 11, textTransform: 'uppercase' },
  tradeBody: { marginBottom: 8 },
  symbol: { color: '#F1F5F9', fontSize: 18, fontWeight: '600' },
  setup: { color: '#94A3B8', fontSize: 14, textTransform: 'capitalize' },
  time: { color: '#64748B', fontSize: 12, marginTop: 4 },
  pnl: { fontSize: 20, fontWeight: 'bold' },
  confirmations: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  confirmBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  confirmText: { color: '#94A3B8', fontSize: 10 },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#F1F5F9', fontSize: 18 },
  emptySubtext: { color: '#64748B', marginTop: 8 },
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
  optionRow: { flexDirection: 'row', flexWrap: 'wrap' },
  option: {
    backgroundColor: '#334155',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: { backgroundColor: '#3B82F6' },
  longOption: { backgroundColor: '#10B981' },
  shortOption: { backgroundColor: '#EF4444' },
  optionText: { color: '#FFF', fontSize: 13 },
  killzoneOption: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#334155',
  },
  killzoneText: { fontSize: 11 },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 14,
    color: '#F1F5F9',
    fontSize: 16,
  },
  notesInput: { height: 100, textAlignVertical: 'top' },
  priceRow: { flexDirection: 'row', gap: 8 },
  priceField: { flex: 1 },
  deleteBtn: {
    backgroundColor: '#7F1D1D',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  deleteText: { color: '#FCA5A5', fontSize: 16 },

  // Image picker styles
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  removeImageBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: -2,
  },
  addImageBtn: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#334155',
    borderWidth: 2,
    borderColor: '#475569',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    color: '#94A3B8',
    fontSize: 28,
    marginTop: -4,
  },
  addImageLabel: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
});
