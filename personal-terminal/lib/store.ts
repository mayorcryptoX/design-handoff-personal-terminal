import { create } from 'zustand';

export type Chain = 'Solana' | 'Ethereum' | 'Base' | 'BSC' | 'Portfolio' | 'Other';
export type Account = 'Main' | 'Prop';
export type TradingType = 'Daily PnL' | 'Spot' | 'Perps' | 'Meme' | 'Swing' | 'Scalp' | 'Copy';
export type Emotion = 'calm' | 'confident' | 'anxious' | 'fomo' | 'frustrated' | 'neutral';

export interface TradeEntry {
  id: string;
  date: string; // ISO
  period: string; // YYYY-MM
  chain: Chain;
  account: Account;
  tradingType: TradingType;
  startCapital: number;
  endCapital: number;
  realizedPnl: number;
  fees: number;
  netPnl: number;
  roi: number;
  winRate: number;
  // manual journal layer
  notes?: string;
  setup?: string;
  screenshotUri?: string;
  emotion?: Emotion;
  discipline?: number; // 0-5
}

export interface SwingTrade {
  id: string;
  opened: string;
  asset: string;
  direction: 'LONG' | 'SHORT';
  size: number;
  entry: number;
  stopLoss: number;
  target: number;
  status: 'open' | 'closed';
  unrealizedPnl: number;
  notes?: string;
}

export interface Transaction {
  id: string;
  date: string;
  name: string;
  category: 'salary' | 'electricity' | 'rent' | 'groceries' | 'food' | 'transport' | 'fitness' | 'subscription' | 'other';
  amount: number; // positive = income, negative = expense
  currency: 'BGN' | 'EUR' | 'USD';
  amountUsd: number;
}

export interface WorkoutSession {
  id: string;
  date: string;
  name: string;
  sets: number;
  totalVolumeKg: number;
}

export interface PersonalRecord {
  exercise: string;
  weightKg: number;
  date: string;
  prevWeightKg?: number;
}

export interface BodyweightEntry {
  date: string;
  kg: number;
}

export interface AppState {
  // auth
  isGoogleConnected: boolean;
  spreadsheetId: string | null;

  // trades
  trades: TradeEntry[];
  swingTrades: SwingTrade[];

  // money
  transactions: Transaction[];

  // gym
  workouts: WorkoutSession[];
  personalRecords: PersonalRecord[];
  bodyweight: BodyweightEntry[];
  gymStreak: number;
  bestStreak: number;

  // ui
  selectedTradeId: string | null;
  tradeFilter: 'all' | 'wins' | 'losses';
  moneyMonthIndex: number;

  // actions
  setGoogleConnected: (id: string) => void;
  setTrades: (trades: TradeEntry[]) => void;
  setSwingTrades: (t: SwingTrade[]) => void;
  setTransactions: (t: Transaction[]) => void;
  setWorkouts: (w: WorkoutSession[]) => void;
  setPersonalRecords: (pr: PersonalRecord[]) => void;
  setBodyweight: (bw: BodyweightEntry[]) => void;
  updateTradeJournal: (id: string, patch: Partial<Pick<TradeEntry, 'notes' | 'setup' | 'screenshotUri' | 'emotion' | 'discipline'>>) => void;
  selectTrade: (id: string | null) => void;
  setTradeFilter: (f: 'all' | 'wins' | 'losses') => void;
  setMoneyMonthIndex: (i: number) => void;
}

export const useStore = create<AppState>((set) => ({
  isGoogleConnected: false,
  spreadsheetId: null,
  trades: [],
  swingTrades: [],
  transactions: MOCK_TRANSACTIONS,
  workouts: MOCK_WORKOUTS,
  personalRecords: MOCK_PRS,
  bodyweight: MOCK_BODYWEIGHT,
  gymStreak: 12,
  bestStreak: 12,
  selectedTradeId: null,
  tradeFilter: 'all',
  moneyMonthIndex: 0,

  setGoogleConnected: (id) => set({ isGoogleConnected: true, spreadsheetId: id }),
  setTrades: (trades) => set({ trades }),
  setSwingTrades: (swingTrades) => set({ swingTrades }),
  setTransactions: (transactions) => set({ transactions }),
  setWorkouts: (workouts) => set({ workouts }),
  setPersonalRecords: (personalRecords) => set({ personalRecords }),
  setBodyweight: (bodyweight) => set({ bodyweight }),
  updateTradeJournal: (id, patch) =>
    set((s) => ({
      trades: s.trades.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),
  selectTrade: (selectedTradeId) => set({ selectedTradeId }),
  setTradeFilter: (tradeFilter) => set({ tradeFilter }),
  setMoneyMonthIndex: (moneyMonthIndex) => set({ moneyMonthIndex }),
}));

// ── Mock seed data ────────────────────────────────────────────────────────────

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2026-06-01', name: 'Salary', category: 'salary', amount: 1950, currency: 'BGN', amountUsd: 1159 },
  { id: '2', date: '2026-06-05', name: 'Debt payment', category: 'other', amount: -306, currency: 'EUR', amountUsd: -356 },
  { id: '3', date: '2026-06-10', name: 'Groceries', category: 'groceries', amount: -120, currency: 'EUR', amountUsd: -139 },
  { id: '4', date: '2026-06-12', name: 'Gym membership', category: 'fitness', amount: -40, currency: 'EUR', amountUsd: -46 },
  { id: '5', date: '2026-06-14', name: 'Electricity', category: 'electricity', amount: -80, currency: 'EUR', amountUsd: -93 },
];

const MOCK_WORKOUTS: WorkoutSession[] = [
  { id: 'w1', date: '2026-06-14', name: 'Push (Chest/Shoulders/Triceps)', sets: 20, totalVolumeKg: 9200 },
  { id: 'w2', date: '2026-06-12', name: 'Pull (Back/Biceps)', sets: 18, totalVolumeKg: 8400 },
  { id: 'w3', date: '2026-06-10', name: 'Legs', sets: 16, totalVolumeKg: 11600 },
  { id: 'w4', date: '2026-06-08', name: 'Push', sets: 19, totalVolumeKg: 9100 },
];

const MOCK_PRS: PersonalRecord[] = [
  { exercise: 'Bench Press', weightKg: 110, date: '2026-06-12', prevWeightKg: 107.5 },
  { exercise: 'Squat', weightKg: 140, date: '2026-06-10', prevWeightKg: 140 },
  { exercise: 'Deadlift', weightKg: 180, date: '2026-05-28', prevWeightKg: 177.5 },
  { exercise: 'OHP', weightKg: 72.5, date: '2026-06-08', prevWeightKg: 70 },
];

const MOCK_BODYWEIGHT: BodyweightEntry[] = [
  { date: '2026-04-20', kg: 82.4 },
  { date: '2026-04-27', kg: 82.0 },
  { date: '2026-05-04', kg: 81.6 },
  { date: '2026-05-11', kg: 81.2 },
  { date: '2026-05-18', kg: 80.9 },
  { date: '2026-05-25', kg: 80.5 },
  { date: '2026-06-01', kg: 80.3 },
  { date: '2026-06-08', kg: 80.1 },
];
