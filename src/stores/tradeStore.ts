import { create } from 'zustand';
import { Trade, Session, Killzone } from '../types';
import * as db from '../lib/database';
import { generateId } from '../lib/utils';

interface TradeState {
  trades: Trade[];
  loading: boolean;
  error: string | null;

  loadTrades: () => Promise<void>;
  addTrade: (trade: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Trade>;
  updateTrade: (trade: Trade) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;
  getTradeById: (id: string) => Trade | undefined;

  // Analytics
  getWinRate: () => number;
  getWinRateBySession: (session: Session) => number;
  getWinRateByKillzone: (killzone: Killzone) => number;
  getKillzoneTrades: (killzone: Killzone) => Trade[];
  getTodayKillzonePnL: (killzone: Killzone) => number;
  getTodayTrades: () => Trade[];
  getTodayPnL: () => number;
}

export const useTradeStore = create<TradeState>((set, get) => ({
  trades: [],
  loading: false,
  error: null,

  loadTrades: async () => {
    set({ loading: true, error: null });
    try {
      const trades = await db.getAllTrades();
      set({ trades, loading: false });
    } catch (err) {
      set({ error: 'Failed to load trades', loading: false });
    }
  },

  addTrade: async (tradeData) => {
    const now = Date.now();
    const trade: Trade = {
      ...tradeData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    await db.insertTrade(trade);
    set((state) => ({ trades: [trade, ...state.trades] }));
    return trade;
  },

  updateTrade: async (trade) => {
    const updated = { ...trade, updatedAt: Date.now() };
    await db.updateTrade(updated);
    set((state) => ({
      trades: state.trades.map((t) => (t.id === trade.id ? updated : t)),
    }));
  },

  deleteTrade: async (id) => {
    await db.deleteTrade(id);
    set((state) => ({
      trades: state.trades.filter((t) => t.id !== id),
    }));
  },

  getTradeById: (id) => get().trades.find((t) => t.id === id),

  getWinRate: () => {
    const completed = get().trades.filter((t) => t.outcome !== 'pending');
    if (completed.length === 0) return 0;
    const wins = completed.filter((t) => t.outcome === 'win').length;
    return (wins / completed.length) * 100;
  },

  getWinRateBySession: (session) => {
    const sessionTrades = get().trades.filter(
      (t) => t.session === session && t.outcome !== 'pending'
    );
    if (sessionTrades.length === 0) return 0;
    const wins = sessionTrades.filter((t) => t.outcome === 'win').length;
    return (wins / sessionTrades.length) * 100;
  },

  getWinRateByKillzone: (killzone) => {
    const kzTrades = get().trades.filter(
      (t) => t.killzone === killzone && t.outcome !== 'pending'
    );
    if (kzTrades.length === 0) return 0;
    const wins = kzTrades.filter((t) => t.outcome === 'win').length;
    return (wins / kzTrades.length) * 100;
  },

  getKillzoneTrades: (killzone) => {
    return get().trades.filter((t) => t.killzone === killzone);
  },

  getTodayKillzonePnL: (killzone) => {
    const todayTrades = get().getTodayTrades();
    return todayTrades
      .filter((t) => t.killzone === killzone)
      .reduce((sum, t) => sum + (t.pnl || 0), 0);
  },

  getTodayTrades: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return get().trades.filter((t) => t.timestamp >= today.getTime());
  },

  getTodayPnL: () => {
    return get()
      .getTodayTrades()
      .reduce((sum, t) => sum + (t.pnl || 0), 0);
  },
}));
