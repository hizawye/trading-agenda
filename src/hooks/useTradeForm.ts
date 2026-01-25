import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Paths, File as ExpoFile } from 'expo-file-system';
import { Session, Killzone, SetupType, TradeDirection, TradeOutcome, Confirmation, Trade } from '../types';
import { getCurrentSession } from '../constants/sessions';
import { getCurrentKillzone } from '../constants/killzones';

export interface TradeFormValues {
  session: Session;
  timeWindow: string;
  killzone: Killzone;
  setupType: SetupType;
  direction: TradeDirection;
  symbol: string;
  entry: string;
  stopLoss: string;
  takeProfit: string;
  outcome: TradeOutcome;
  pnl: string;
  notes: string;
  confirmations: Confirmation[];
  images: string[];
  quickMode: boolean;
}

export interface TradeFormHandlers {
  setSession: (s: Session) => void;
  setTimeWindow: (s: string) => void;
  setKillzone: (k: Killzone) => void;
  setSetupType: (s: SetupType) => void;
  setDirection: (d: TradeDirection) => void;
  setSymbol: (s: string) => void;
  setEntry: (s: string) => void;
  setStopLoss: (s: string) => void;
  setTakeProfit: (s: string) => void;
  setOutcome: (o: TradeOutcome) => void;
  setPnl: (s: string) => void;
  setNotes: (s: string) => void;
  setQuickMode: (b: boolean) => void;
  toggleConfirmation: (c: Confirmation) => void;
  pickImage: () => Promise<void>;
  removeImage: (uri: string) => void;
  resetForm: () => void;
  loadTrade: (trade: Trade) => void;
}

export function useTradeForm() {
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
  const [quickMode, setQuickMode] = useState(true);

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
    setQuickMode(true);
  };

  const loadTrade = (trade: Trade) => {
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
    setQuickMode(false);
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

  const isValidQuick = symbol.trim().length > 0;
  const isValidFull = symbol.trim().length > 0 && entry && stopLoss && takeProfit;

  const values: TradeFormValues = {
    session,
    timeWindow,
    killzone,
    setupType,
    direction,
    symbol,
    entry,
    stopLoss,
    takeProfit,
    outcome,
    pnl,
    notes,
    confirmations,
    images,
    quickMode,
  };

  const handlers: TradeFormHandlers = {
    setSession,
    setTimeWindow,
    setKillzone,
    setSetupType,
    setDirection,
    setSymbol,
    setEntry,
    setStopLoss,
    setTakeProfit,
    setOutcome,
    setPnl,
    setNotes,
    setQuickMode,
    toggleConfirmation,
    pickImage,
    removeImage,
    resetForm,
    loadTrade,
  };

  return {
    values,
    handlers,
    isValidQuick,
    isValidFull,
  };
}
