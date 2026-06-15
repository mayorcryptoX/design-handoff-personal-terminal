import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '../../constants/tokens';
import { Card } from '../../components/ui/Card';
import { Eyebrow, Mono, Title } from '../../components/ui/Typography';
import { useStore, TradeEntry, Emotion } from '../../lib/store';

const EMOTION_COLORS: Record<Emotion, string> = {
  calm: '#4CAF50',
  confident: Colors.textPrimary,
  anxious: '#FF9800',
  fomo: Colors.red,
  frustrated: Colors.red,
  neutral: Colors.textMuted,
};

const MOCK_TRADES: TradeEntry[] = [
  {
    id: '1', date: '2026-06-14', period: '2026-06', chain: 'Solana', account: 'Main',
    tradingType: 'Perps', startCapital: 5000, endCapital: 5420, realizedPnl: 430,
    fees: 12, netPnl: 418, roi: 8.36, winRate: 100,
    notes: 'SOL broke above key resistance. Clean entry on retest.', emotion: 'confident', discipline: 5,
  },
  {
    id: '2', date: '2026-06-13', period: '2026-06', chain: 'Base', account: 'Main',
    tradingType: 'Meme', startCapital: 1000, endCapital: 780, realizedPnl: -222,
    fees: 8, netPnl: -230, roi: -23, winRate: 0,
    notes: 'FOMO entry. Should have waited for confirmation.', emotion: 'fomo', discipline: 2,
  },
  {
    id: '3', date: '2026-06-12', period: '2026-06', chain: 'Ethereum', account: 'Prop',
    tradingType: 'Scalp', startCapital: 2000, endCapital: 2180, realizedPnl: 185,
    fees: 5, netPnl: 180, roi: 9, winRate: 100,
    notes: 'ETH liquidity sweep. Took profits quickly.', emotion: 'calm', discipline: 4,
  },
  {
    id: '4', date: '2026-06-10', period: '2026-06', chain: 'Solana', account: 'Main',
    tradingType: 'Daily PnL', startCapital: 4800, endCapital: 4620, realizedPnl: -185,
    fees: 15, netPnl: -200, roi: -4.17, winRate: 40,
    notes: 'Choppy day. Lost discipline mid-session.', emotion: 'frustrated', discipline: 2,
  },
];

export default function TradesScreen() {
  const router = useRouter();
  const { trades: storeTrades, tradeFilter, setTradeFilter, selectTrade } = useStore();

  const trades = storeTrades.length > 0 ? storeTrades : MOCK_TRADES;

  const totalNet = trades.reduce((s, t) => s + t.netPnl, 0);
  const wins = trades.filter((t) => t.netPnl > 0);
  const winRate = trades.length > 0 ? Math.round((wins.length / trades.length) * 100) : 0;
  const avgR = trades.length > 0
    ? (trades.reduce((s, t) => s + t.roi, 0) / trades.length).toFixed(1)
    : '0.0';

  const filtered = trades.filter((t) =>
    tradeFilter === 'all' ? true : tradeFilter === 'wins' ? t.netPnl > 0 : t.netPnl < 0,
  );

  function openTrade(t: TradeEntry) {
    selectTrade(t.id);
    router.push(`/trade/${t.id}`);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Title style={{ marginBottom: 4 }}>Trading journal</Title>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <StatTile label="Net P&L" value={fmtPnl(totalNet)} color={totalNet >= 0 ? Colors.textPrimary : Colors.red} />
        <StatTile label="Win rate" value={`${winRate}%`} />
        <StatTile label="Trades" value={`${trades.length}`} />
        <StatTile label="Avg ROI" value={`${avgR}%`} color={parseFloat(avgR) >= 0 ? Colors.textPrimary : Colors.red} />
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {(['all', 'wins', 'losses'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, tradeFilter === f && styles.chipActive]}
            onPress={() => setTradeFilter(f)}
          >
            <Text style={[styles.chipText, tradeFilter === f && styles.chipTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Trade cards */}
      {filtered.map((t) => (
        <TouchableOpacity key={t.id} onPress={() => openTrade(t)} activeOpacity={0.7}>
          <Card radius={16} pad={14} style={styles.tradeCard}>
            <View style={styles.tradeTop}>
              <Text style={styles.tradeTicker}>{t.chain}</Text>
              <View style={[styles.dirBadge, t.tradingType === 'Perps' && t.netPnl < 0 && styles.dirBadgeShort]}>
                <Text style={[styles.dirText, t.netPnl < 0 && styles.dirTextShort]}>{t.tradingType}</Text>
              </View>
              <Text style={[styles.tradePnl, t.netPnl < 0 && { color: Colors.red }]}>
                {fmtPnl(t.netPnl)}
              </Text>
            </View>

            {t.notes ? (
              <Text style={styles.tradeNotes} numberOfLines={2}>{t.notes}</Text>
            ) : null}

            <View style={styles.tradeBottom}>
              <Mono style={styles.tradeDate}>{t.date}</Mono>
              {t.emotion ? (
                <View style={[styles.emotionChip, { backgroundColor: `${EMOTION_COLORS[t.emotion]}18` }]}>
                  <Text style={[styles.emotionText, { color: EMOTION_COLORS[t.emotion] }]}>{t.emotion}</Text>
                </View>
              ) : null}
              {t.discipline != null ? (
                <View style={styles.discRow}>
                  <Mono style={styles.discLabel}>DISC</Mono>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <View
                      key={n}
                      style={[
                        styles.discBar,
                        n <= t.discipline!
                          ? { backgroundColor: t.discipline! >= 4 ? Colors.textPrimary : Colors.red }
                          : { backgroundColor: 'rgba(0,0,0,0.16)' },
                      ]}
                    />
                  ))}
                </View>
              ) : null}
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function StatTile({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Card radius={16} pad={14} style={styles.statTile}>
      <Eyebrow style={{ fontSize: 10 }}>{label}</Eyebrow>
      <Mono style={[styles.statValue, color ? { color } : {}]}>{value}</Mono>
    </Card>
  );
}

function fmtPnl(n: number) {
  return `${n >= 0 ? '+' : '-'}$${Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.ground },
  content: { padding: Spacing.screenH, paddingTop: Spacing.screenTop, paddingBottom: Spacing.screenBottom, gap: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statTile: { width: '47.5%', gap: 6 },
  statValue: { fontSize: 24 },
  filterRow: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.22)' },
  chipActive: { backgroundColor: Colors.textPrimary, borderColor: Colors.textPrimary },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },
  chipTextActive: { color: Colors.invertedText },
  tradeCard: { gap: 8 },
  tradeTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tradeTicker: { fontFamily: 'SpaceMono', fontSize: 16, fontWeight: '600', color: Colors.textPrimary, flex: 1 },
  dirBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: 'rgba(0,0,0,0.06)' },
  dirBadgeShort: { backgroundColor: 'rgba(216,30,5,0.10)' },
  dirText: { fontSize: 10.5, fontWeight: '700', color: Colors.textPrimary },
  dirTextShort: { color: Colors.red },
  tradePnl: { fontFamily: 'SpaceMono', fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  tradeNotes: { fontSize: 12.5, color: Colors.textSecondary, lineHeight: 18 },
  tradeBottom: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tradeDate: { fontSize: 11, color: Colors.textMuted, flex: 1 },
  emotionChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  emotionText: { fontSize: 11, fontWeight: '600' },
  discRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  discLabel: { fontSize: 10, color: Colors.textMuted, marginRight: 2 },
  discBar: { width: 13, height: 4, borderRadius: 2 },
});
