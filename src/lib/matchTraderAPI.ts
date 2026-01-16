import * as SecureStore from 'expo-secure-store';
import type {
  BrokerCredentials,
  BrokerTokens,
  BrokerPosition,
  BrokerClosedTrade,
  BrokerBalance,
} from '../types/broker';

// IMPORTANT: Replace this with your deployed proxy URL after deployment
// For local testing: http://localhost:3000
// For production: https://your-app.vercel.app or https://your-app.railway.app
const PROXY_URL = 'http://localhost:3000'; // TODO: Update after deployment

class MatchTraderAPI {
  private tokens: BrokerTokens | null = null;

  // Authentication
  async login(credentials: BrokerCredentials): Promise<BrokerTokens> {
    try {
      const response = await fetch(`${PROXY_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          partnerId: credentials.brokerId || '117',
        }),
      });

      // Try to parse as JSON regardless of content-type
      let data;
      const responseText = await response.text();

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Invalid response: ${response.status} - ${responseText.substring(0, 300)}`);
      }

      if (!response.ok) {
        const errorMsg = data.detail || data.message || data.title || data.error || JSON.stringify(data);
        throw new Error(`${errorMsg} (HTTP ${response.status})`);
      }

      // Maven returns multiple trading accounts, use the selected one
      const selectedAccount = data.selectedTradingAccount;
      const systemUuid = selectedAccount?.offer?.system?.uuid;
      const tradingApiToken = selectedAccount?.tradingApiToken;
      const tradingAccountToken = selectedAccount?.tradingAccountToken?.token;
      const authToken = data.token;

      if (!authToken) {
        throw new Error('No authentication token in response');
      }

      if (!systemUuid || !tradingApiToken) {
        throw new Error('No trading account found. Please contact support.');
      }

      console.log('Login successful! System UUID:', systemUuid);

      this.tokens = {
        token: authToken,
        tradingApiToken: tradingApiToken,
        tradingAccountToken: tradingAccountToken,
        systemUuid: systemUuid,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };

      await SecureStore.setItemAsync('broker_tokens', JSON.stringify(this.tokens));
      await SecureStore.setItemAsync('broker_email', credentials.email);

      return this.tokens;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    this.tokens = null;
    await SecureStore.deleteItemAsync('broker_tokens');
    await SecureStore.deleteItemAsync('broker_email');
  }

  async loadStoredTokens(): Promise<BrokerTokens | null> {
    const stored = await SecureStore.getItemAsync('broker_tokens');
    if (!stored) return null;

    this.tokens = JSON.parse(stored);

    // Check expiry
    if (this.tokens?.expiresAt && this.tokens.expiresAt < Date.now()) {
      await this.logout();
      return null;
    }

    // Verify required fields
    if (!this.tokens?.systemUuid || !this.tokens?.tradingApiToken) {
      await this.logout();
      return null;
    }

    return this.tokens;
  }

  async getStoredEmail(): Promise<string | null> {
    return await SecureStore.getItemAsync('broker_email');
  }

  // API Calls
  private async authenticatedFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.tokens) {
      throw new Error('Not authenticated');
    }

    // Build Maven API path
    const mavenPath = `mtr-api/${this.tokens.systemUuid}${endpoint}`;
    const url = `${PROXY_URL}/api/maven/${mavenPath}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'token': this.tokens.token,
        'tradingApiToken': this.tokens.tradingApiToken,
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
      },
    });

    // Try to parse response
    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      // Not JSON - probably HTML error page
      if (response.status === 401) {
        await this.logout();
        throw new Error('Session expired');
      }
      console.error('Non-JSON response:', responseText.substring(0, 300));
      throw new Error(`Invalid API response from ${endpoint}: ${response.status}`);
    }

    if (response.status === 401) {
      await this.logout();
      throw new Error('Session expired');
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${data.message || data.error || 'Unknown error'}`);
    }

    return data;
  }

  // Get open positions
  async getOpenPositions(): Promise<BrokerPosition[]> {
    try {
      const data = await this.authenticatedFetch('/open-positions', {
        method: 'GET',
      });
      return this.mapPositions(data);
    } catch (error: any) {
      console.log('getOpenPositions failed:', error.message);
      return [];
    }
  }

  // Get closed trades
  async getClosedPositions(limit: number = 100): Promise<BrokerClosedTrade[]> {
    try {
      const data = await this.authenticatedFetch('/closed-positions', {
        method: 'POST',
        body: JSON.stringify({ limit }),
      });
      return this.mapClosedTrades(data);
    } catch (error: any) {
      console.log('getClosedPositions failed:', error.message);
      return [];
    }
  }

  // Get account balance
  async getBalance(): Promise<BrokerBalance> {
    try {
      const data = await this.authenticatedFetch('/balance', {
        method: 'GET',
      });
      return {
        balance: data.balance || 0,
        equity: data.equity || 0,
        margin: data.margin || 0,
        freeMargin: data.freeMargin || 0,
        marginLevel: data.marginLevel,
      };
    } catch (error: any) {
      console.log('getBalance failed:', error.message);
      return {
        balance: 0,
        equity: 0,
        margin: 0,
        freeMargin: 0,
      };
    }
  }

  // Data mapping helpers
  private mapPositions(data: any): BrokerPosition[] {
    if (!Array.isArray(data)) return [];
    return data.map((pos: any) => ({
      id: pos.id || pos.ticket,
      symbol: pos.symbol,
      type: pos.side === 'BUY' || pos.side === 0 ? 'buy' : 'sell',
      volume: pos.volume,
      openPrice: pos.openPrice || pos.priceOpen,
      currentPrice: pos.currentPrice || pos.priceCurrent,
      profit: pos.profit,
      openTime: pos.openTime || pos.timeOpen,
      stopLoss: pos.sl || pos.stopLoss,
      takeProfit: pos.tp || pos.takeProfit,
    }));
  }

  private mapClosedTrades(data: any): BrokerClosedTrade[] {
    if (!Array.isArray(data)) return [];
    return data.map((trade: any) => ({
      id: trade.id || trade.ticket,
      symbol: trade.symbol,
      type: trade.side === 'BUY' || trade.side === 0 ? 'buy' : 'sell',
      volume: trade.volume,
      openPrice: trade.openPrice || trade.priceOpen,
      closePrice: trade.closePrice || trade.priceClose,
      profit: trade.profit,
      openTime: trade.openTime || trade.timeOpen,
      closeTime: trade.closeTime || trade.timeClose,
      commission: trade.commission,
      swap: trade.swap,
    }));
  }
}

export const matchTraderAPI = new MatchTraderAPI();
