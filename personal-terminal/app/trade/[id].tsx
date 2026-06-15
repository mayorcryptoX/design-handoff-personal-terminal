import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing } from '../../constants/tokens';
import { Card } from '../../components/ui/Card';
import { Eyebrow, Mono } from '../../components/ui/Typography';
import { useStore, Emotion } from '../../lib/store';

const EMOTIONS: Emotion[] = ['calm', 'confident', 'neutral', 'anxious', 'fomo', 'frustrated'];
const EMOTION_COLORS: Record<Emotion, string> = {
  calm: '#4CAF50',
  confident: Colors.textPrimary,
  anxious: '#FF9800',
  fomo: Colors.red,
  frustrated: Colors.red,
  neutral: Colors.textMuted,
};

const MOCK_TRADES = [
  {
    id: '1', date: '2026-06-14', period: '2026-06', chain: 'Solana', account: 'Main',
    tradingType: 'Perps', startCapital: 5000, endCapital: 5420, realizedPnl: 430,
    fees: 12, netPnl: 418, roi: 8.36, winRate: 100,
    notes: 'SOL broke above key resistance. Clean entry on retest.', emotion: 'confident' as Emotion, discipline: 5,
  },
  {
    id: '2', date: '2026-06-13', period: '2026-06', chain: 'Base', account: 'Main',
    tradingType: 'Meme', startCapital: 1000, endCapital: 780, realizedPnl: -222,
    fees: 8, netPnl: -230, roi: -23, winRate: 0,
    notes: 'FOMO entry. Should have waited for confirmation.', emotion: 'fomo' as Emotion, discipline: 2,
  },
  {
    id: '3', date: '2026-06-12', period: '2026-06', chain: 'Ethereum', account: 'Prop',
    tradingType: 'Scalp', startCapital: 2000, endCapital: 2180, realizedPnl: 185,
    fees: 5, netPnl: 180, roi: 9, winRate: 100,
    notes: 'ETH liquidity sweep. Took profits quickly.', emotion: 'calm' as Emotion, discipline: 4,
  },
  {
    id: '4', date: '2026-06-10', period: '2026-06', chain: 'Solana', account: 'Main',
    tradingType: 'Daily PnL', startCapital: 4800, endCapital: 4620, realizedPnl: -185,
    fees: 15, netPnl: -200, roi: -4.17, winRate: 40,
    notes: 'Choppy day. Lost discipline mid-session.', emotion: 'frustrated' as Emotion, discipline: 2,
  },
];

export default function TradeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { trades: storeTrades, updateTradeJournal } = useStore();

  const source = storeTrades.length > 0 ? storeTrades : MOCK_TRADES;
  const trade = source.find((t) => t.id === id) ?? source[0];

  const [notes, setNotes] = useState(trade?.notes ?? '');
  const [emotion, setEmotion] = useState<Emotion | undefined>(trade?.emotion);
  const [discipline, setDiscipline] = useState(trade?.discipline ?? 0);

  if (!trade) return null;

  function save() {
    updateTradeJournal(trade.id, { notes, emotion, discipline });
  }

  const pnlColor = trade.netPnl >= 0 ? Colors.textPrimary : Colors.red;
  const roi = trade.roi;
  const rColor = roi >= 0 ? Colors.textPrimary : Colors.red;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Back */}
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={20} color={Colors.textMuted} />
        <Text style={styles.backLabel}>Journal</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.ticker}>{trade.chain}</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{trade.tradingType}</Text>
        </View>
        <Mono style={styles.dateStr}>{trade.date}</Mono>
      </View>

      {/* Big P&L */}
      <Text style={[styles.bigPnl, { color: pnlColor }]}>
        {trade.netPnl >= 0 ? '+' : ''}${Math.abs(trade.netPnl).toLocaleString()}
      </Text>

      {/* Params grid */}
      <View style={styles.paramsGrid}>
        <ParamTile label="Start Capital" value={`$${trade.startCapital.toLocaleString()}`} />
        <ParamTile label="End Capital" value={`$${trade.endCapital.toLocaleString()}`} />
        <ParamTile label="Fees" value={`$${trade.fees}`} />
        <ParamTile label="ROI" value={`${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%`} valueColor={rColor} />
      </View>

      {/* Screenshot placeholder */}
      <View style={styles.screenshotSlot}>
        <MaterialIcons name="image" size={28} color={Colors.textMuted} />
        <Mono style={styles.screenshotCaption}>chart screenshot</Mono>
      </View>

      {/* Setup & notes */}
      <Card radius={16}>
        <Eyebrow style={{ marginBottom: 8 }}>Setup &amp; notes</Eyebrow>
        <TextInput
          style={styles.notesInput}
          multiline
          placeholder="Describe your setup, execution, and what you'd do differently..."
          placeholderTextColor={Colors.textMuted}
          value={notes}
          onChangeText={setNotes}
          onBlur={save}
        />
      </Card>

      {/* Psychology */}
      <Card radius={16}>
        <Eyebrow style={{ marginBottom: 12 }}>Psychology</Eyebrow>

        <View style={styles.psychRow}>
          <View style={styles.psychLeft}>
            <Text style={styles.psychLabel}>Emotion</Text>
            <View style={styles.emotionGrid}>
              {EMOTIONS.map((e) => (
                <TouchableOpacity
                  key={e}
                  style={[styles.emotionBtn, emotion === e && { backgroundColor: `${EMOTION_COLORS[e]}22`, borderColor: EMOTION_COLORS[e] }]}
                  onPress={() => { setEmotion(e); save(); }}
                >
                  <Text style={[styles.emotionBtnText, { color: EMOTION_COLORS[e] }]}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.psychRight}>
            <Text style={styles.psychLabel}>Discipline</Text>
            <Text style={styles.discScore}>{discipline}/5</Text>
            <View style={styles.discBars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[
                    styles.discSeg,
                    n <= discipline
                      ? { backgroundColor: discipline >= 4 ? Colors.textPrimary : Colors.red }
                      : { backgroundColor: 'rgba(0,0,0,0.16)' },
                  ]}
                  onPress={() => { setDiscipline(n); save(); }}
                />
              ))}
            </View>
          </View>
        </View>
      </Card>

      {/* Chain / account info */}
      <Card radius={16} pad={14}>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Chain</Text>
          <Mono style={styles.infoVal}>{trade.chain}</Mono>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Account</Text>
          <Mono style={styles.infoVal}>{trade.account}</Mono>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Win rate</Text>
          <Mono style={styles.infoVal}>{trade.winRate}%</Mono>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoKey}>Realized P&L</Text>
          <Mono style={[styles.infoVal, trade.realizedPnl < 0 && { color: Colors.red }]}>
            {trade.realizedPnl >= 0 ? '+' : ''}${trade.realizedPnl}
          </Mono>
        </View>
      </Card>
    </ScrollView>
  );
}

function ParamTile({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <Card radius={14} pad={14} style={{ width: '47.5%', gap: 6 }}>
      <Eyebrow style={{ fontSize: 10 }}>{label}</Eyebrow>
      <Mono style={[{ fontSize: 18 }, valueColor ? { color: valueColor } : {}]}>{value}</Mono>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.ground },
  content: { padding: Spacing.screenH, paddingTop: Spacing.screenTop, paddingBottom: Spacing.screenBottom, gap: 12 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  backLabel: { fontSize: 14, color: Colors.textMuted },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ticker: { fontFamily: 'SpaceMono', fontSize: 28, fontWeight: '600', color: Colors.textPrimary, flex: 1 },
  typeBadge: { backgroundColor: 'rgba(0,0,0,0.06)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  typeText: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary },
  dateStr: { fontSize: 12, color: Colors.textMuted },
  bigPnl: { fontFamily: 'SpaceMono', fontSize: 44, fontWeight: '500', letterSpacing: -0.88 },
  paramsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  screenshotSlot: {
    height: 170, borderRadius: 16, borderWidth: 1, borderColor: Colors.hairlineStrong,
    alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.hatch1,
  },
  screenshotCaption: { fontSize: 11, color: Colors.textMuted },
  notesInput: { fontSize: 14, lineHeight: 22, color: Colors.textNote, minHeight: 80, textAlignVertical: 'top' },
  psychRow: { flexDirection: 'row', gap: 14 },
  psychLeft: { flex: 1 },
  psychRight: { flex: 1 },
  psychLabel: { fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, fontFamily: 'SpaceMono', marginBottom: 8 },
  emotionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  emotionBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)' },
  emotionBtnText: { fontSize: 12, fontWeight: '600' },
  divider: { width: 1, backgroundColor: 'rgba(0,0,0,0.10)', marginVertical: -4 },
  discScore: { fontFamily: 'SpaceMono', fontSize: 22, color: Colors.textPrimary, marginBottom: 10 },
  discBars: { flexDirection: 'row', gap: 4 },
  discSeg: { flex: 1, height: 7, borderRadius: 3 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  infoKey: { fontSize: 13, color: Colors.textMuted },
  infoVal: { fontSize: 13 },
});
