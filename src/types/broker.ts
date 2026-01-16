export interface BrokerCredentials {
  email: string;
  password: string;
  brokerId: string;
}

export interface BrokerTokens {
  token: string;
  tradingApiToken: string;
  tradingAccountToken?: string;
  systemUuid: string;
  expiresAt?: number;
}

export interface BrokerPosition {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  openPrice: number;
  currentPrice: number;
  profit: number;
  openTime: string;
  stopLoss?: number;
  takeProfit?: number;
}

export interface BrokerClosedTrade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  openPrice: number;
  closePrice: number;
  profit: number;
  openTime: string;
  closeTime: string;
  commission?: number;
  swap?: number;
}

export interface BrokerBalance {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel?: number;
}

export interface BrokerConnectionStatus {
  connected: boolean;
  email?: string;
  lastSync?: number;
}
