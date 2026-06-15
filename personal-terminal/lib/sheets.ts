import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { TradeEntry, SwingTrade } from './store';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const TOKEN_KEY = 'gsheets_token';

export async function signInWithGoogle(): Promise<string | null> {
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'personalTerminal' });

  const request = new AuthSession.AuthRequest({
    clientId: CLIENT_ID,
    scopes: SCOPES,
    redirectUri,
  });

  const result = await request.promptAsync({
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  });

  if (result.type === 'success' && result.params.access_token) {
    await SecureStore.setItemAsync(TOKEN_KEY, result.params.access_token);
    return result.params.access_token;
  }
  return null;
}

async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

async function sheetValues(spreadsheetId: string, range: string): Promise<string[][]> {
  const token = await getToken();
  if (!token) throw new Error('Not authenticated');

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Sheets API ${res.status}`);
  const json = await res.json();
  return json.values ?? [];
}

// ── Parsers ──────────────────────────────────────────────────────────────────

export async function fetchTrades(spreadsheetId: string): Promise<TradeEntry[]> {
  // Sheet: "Trading PnL" — row 1 = headers
  // Columns: Date, Period, Chain, Account, Trading Type, Start Capital,
  //          End Capital, Realized PnL, Fees, Net PnL, ROI, Win Rate
  const rows = await sheetValues(spreadsheetId, 'Trading PnL!A2:L1000');
  return rows
    .filter((r) => r[0])
    .map((r, i) => ({
      id: String(i),
      date: r[0] ?? '',
      period: r[1] ?? '',
      chain: (r[2] as TradeEntry['chain']) ?? 'Other',
      account: (r[3] as TradeEntry['account']) ?? 'Main',
      tradingType: (r[4] as TradeEntry['tradingType']) ?? 'Daily PnL',
      startCapital: parseFloat(r[5]) || 0,
      endCapital: parseFloat(r[6]) || 0,
      realizedPnl: parseFloat(r[7]) || 0,
      fees: parseFloat(r[8]) || 0,
      netPnl: parseFloat(r[9]) || 0,
      roi: parseFloat(r[10]) || 0,
      winRate: parseFloat(r[11]) || 0,
    }));
}

export async function fetchSwingTrades(spreadsheetId: string): Promise<SwingTrade[]> {
  // Sheet: "Swing Trades" — Opened, Asset, Direction, Size($), Entry, SL, Target, Status, Unrealized P/L, Notes
  const rows = await sheetValues(spreadsheetId, 'Swing Trades!A2:J100');
  return rows
    .filter((r) => r[0])
    .map((r, i) => ({
      id: String(i),
      opened: r[0] ?? '',
      asset: r[1] ?? '',
      direction: (r[2]?.toUpperCase() as 'LONG' | 'SHORT') ?? 'LONG',
      size: parseFloat(r[3]) || 0,
      entry: parseFloat(r[4]) || 0,
      stopLoss: parseFloat(r[5]) || 0,
      target: parseFloat(r[6]) || 0,
      status: r[7]?.toLowerCase() === 'open' ? 'open' : 'closed',
      unrealizedPnl: parseFloat(r[8]) || 0,
      notes: r[9] ?? '',
    }));
}

export function promptSpreadsheetId(): string {
  // In production surface a TextInput modal for the user to paste their sheet ID.
  // Returning empty string means the caller should show the UI.
  return '';
}
