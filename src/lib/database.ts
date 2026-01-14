import * as SQLite from 'expo-sqlite';
import { Trade, Alert, Rule } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('trading-agenda.db');
  await initializeTables();
  return db;
};

const initializeTables = async () => {
  if (!db) return;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS trades (
      id TEXT PRIMARY KEY,
      timestamp INTEGER NOT NULL,
      session TEXT NOT NULL,
      timeWindow TEXT,
      setupType TEXT NOT NULL,
      direction TEXT NOT NULL,
      symbol TEXT DEFAULT '',
      entry REAL,
      stopLoss REAL,
      takeProfit REAL,
      outcome TEXT DEFAULT 'pending',
      pnl REAL,
      riskReward REAL,
      images TEXT DEFAULT '[]',
      notes TEXT DEFAULT '',
      confirmations TEXT DEFAULT '[]',
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      time TEXT NOT NULL,
      label TEXT NOT NULL,
      description TEXT,
      enabled INTEGER DEFAULT 1,
      days TEXT DEFAULT '[1,2,3,4,5]'
    );

    CREATE TABLE IF NOT EXISTS rules (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      rule TEXT NOT NULL,
      active INTEGER DEFAULT 1,
      "order" INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_trades_timestamp ON trades(timestamp);
    CREATE INDEX IF NOT EXISTS idx_trades_session ON trades(session);
    CREATE INDEX IF NOT EXISTS idx_trades_outcome ON trades(outcome);
  `);
};

// Trade CRUD operations
export const insertTrade = async (trade: Trade): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO trades (id, timestamp, session, timeWindow, setupType, direction, symbol, entry, stopLoss, takeProfit, outcome, pnl, riskReward, images, notes, confirmations, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    trade.id,
    trade.timestamp,
    trade.session,
    trade.timeWindow,
    trade.setupType,
    trade.direction,
    trade.symbol,
    trade.entry,
    trade.stopLoss,
    trade.takeProfit,
    trade.outcome,
    trade.pnl ?? null,
    trade.riskReward ?? null,
    JSON.stringify(trade.images),
    trade.notes,
    JSON.stringify(trade.confirmations),
    trade.createdAt,
    trade.updatedAt
  );
};

export const updateTrade = async (trade: Trade): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE trades SET timestamp=?, session=?, timeWindow=?, setupType=?, direction=?, symbol=?, entry=?, stopLoss=?, takeProfit=?, outcome=?, pnl=?, riskReward=?, images=?, notes=?, confirmations=?, updatedAt=?
     WHERE id=?`,
    trade.timestamp,
    trade.session,
    trade.timeWindow,
    trade.setupType,
    trade.direction,
    trade.symbol,
    trade.entry,
    trade.stopLoss,
    trade.takeProfit,
    trade.outcome,
    trade.pnl ?? null,
    trade.riskReward ?? null,
    JSON.stringify(trade.images),
    trade.notes,
    JSON.stringify(trade.confirmations),
    Date.now(),
    trade.id
  );
};

export const deleteTrade = async (id: string): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM trades WHERE id=?', id);
};

export const getAllTrades = async (): Promise<Trade[]> => {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>('SELECT * FROM trades ORDER BY timestamp DESC');
  return rows.map(parseTrade);
};

export const getTradeById = async (id: string): Promise<Trade | null> => {
  const database = await getDatabase();
  const row = await database.getFirstAsync<any>('SELECT * FROM trades WHERE id=?', id);
  return row ? parseTrade(row) : null;
};

const parseTrade = (row: any): Trade => ({
  id: row.id,
  timestamp: Number(row.timestamp),
  session: row.session,
  timeWindow: row.timeWindow || '',
  setupType: row.setupType,
  direction: row.direction,
  symbol: row.symbol || '',
  entry: Number(row.entry) || 0,
  stopLoss: Number(row.stopLoss) || 0,
  takeProfit: Number(row.takeProfit) || 0,
  outcome: row.outcome,
  pnl: row.pnl ? Number(row.pnl) : undefined,
  riskReward: row.riskReward ? Number(row.riskReward) : undefined,
  images: JSON.parse(row.images || '[]'),
  notes: row.notes || '',
  confirmations: JSON.parse(row.confirmations || '[]'),
  createdAt: Number(row.createdAt),
  updatedAt: Number(row.updatedAt),
});

// Alert CRUD operations
export const insertAlert = async (alert: Alert): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT INTO alerts (id, time, label, description, enabled, days) VALUES (?, ?, ?, ?, ?, ?)',
    alert.id,
    alert.time,
    alert.label,
    alert.description ?? null,
    alert.enabled ? 1 : 0,
    JSON.stringify(alert.days)
  );
};

export const updateAlert = async (alert: Alert): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync(
    'UPDATE alerts SET time=?, label=?, description=?, enabled=?, days=? WHERE id=?',
    alert.time,
    alert.label,
    alert.description ?? null,
    alert.enabled ? 1 : 0,
    JSON.stringify(alert.days),
    alert.id
  );
};

export const deleteAlert = async (id: string): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM alerts WHERE id=?', id);
};

export const getAllAlerts = async (): Promise<Alert[]> => {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>(
    'SELECT id, time, label, description, (enabled + 0) as enabled, days FROM alerts ORDER BY time'
  );
  return rows.map(parseAlert);
};

const parseAlert = (row: any): Alert => ({
  id: row.id,
  time: row.time,
  label: row.label,
  description: row.description,
  enabled: row.enabled === 1 || row.enabled === '1' || row.enabled === true,
  days: JSON.parse(row.days || '[1,2,3,4,5]'),
});

// Rule CRUD operations
export const insertRule = async (rule: Rule): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT INTO rules (id, category, rule, active, "order") VALUES (?, ?, ?, ?, ?)',
    rule.id,
    rule.category,
    rule.rule,
    rule.active ? 1 : 0,
    rule.order
  );
};

export const updateRule = async (rule: Rule): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync(
    'UPDATE rules SET category=?, rule=?, active=?, "order"=? WHERE id=?',
    rule.category,
    rule.rule,
    rule.active ? 1 : 0,
    rule.order,
    rule.id
  );
};

export const deleteRule = async (id: string): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM rules WHERE id=?', id);
};

export const getAllRules = async (): Promise<Rule[]> => {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>(
    'SELECT id, category, rule, (active + 0) as active, "order" FROM rules ORDER BY category, "order"'
  );
  return rows.map(parseRule);
};

const parseRule = (row: any): Rule => ({
  id: row.id,
  category: row.category,
  rule: row.rule,
  order: Number(row.order) || 0,
  active: row.active === 1 || row.active === '1' || row.active === true,
});
