import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radii } from '../../constants/tokens';
import { Card } from '../../components/ui/Card';
import { Eyebrow, BigValue, Mono } from '../../components/ui/Typography';
import { Sparkline } from '../../components/charts/Sparkline';
import { useStore } from '../../lib/store';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const WEEK_DONE = [true, true, false, true, true, false, false]; // mock
const TODAY_IDX = 6;

export default function HomeScreen() {
  const router = useRouter();
  const { trades, transactions, gymStreak } = useStore();

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const monthTrades = trades.filter((t) => t.period === monthKey);
  const netMonth = monthTrades.reduce((s, t) => s + t.netPnl, 0);
  const monthIncome = transactions.filter((t) => t.amountUsd > 0).reduce((s, t) => s + t.amountUsd, 0);
  const monthOut = Math.abs(transactions.filter((t) => t.amountUsd < 0).reduce((s, t) => s + t.amountUsd, 0));

  const totalNetPnl = trades.reduce((s, t) => s + t.netPnl, 0);
  const winningDays = trades.filter((t) => t.netPnl > 0).length;
  const winRate = trades.length > 0 ? Math.round((winningDays / trades.length) * 100) : 67;

  const sparkData = trades.length > 0
    ? trades.slice(-12).map((t) => t.netPnl)
    : [-800, 1200, -400, 2100, 900, 1600, 3900, -2480, 1100, 2800, 900, 1400];

  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const recentActivity = [
    { icon: 'fitness_center' as const, title: 'Push workout', sub: 'Gym · Today', value: '20 sets' },
    { icon: 'candlestick_chart' as const, title: 'Trading', sub: `Trades · ${monthKey}`, value: fmt(netMonth, true) },
    { icon: 'account_balance_wallet' as const, title: 'Net cashflow', sub: 'Money · June', value: `$${Math.round(monthIncome - monthOut)}` },
  ];

  function fmt(n: number, signed = false) {
    const prefix = signed && n >= 0 ? '+' : '';
    return `${prefix}$${Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting */}
      <View style={styles.greeting}>
        <Eyebrow>Good morning</Eyebrow>
        <Text style={styles.dateHeadline}>{dateStr}</Text>
      </View>

      {/* Net hero card */}
      <Card style={styles.heroCard}>
        <Eyebrow>Net this month</Eyebrow>
        <View style={styles.heroRow}>
          <BigValue style={{ color: netMonth >= 0 ? Colors.textPrimary : Colors.red, fontSize: 38 }}>
            {fmt(netMonth, true)}
          </BigValue>
          <Sparkline data={sparkData} positive={netMonth >= 0} />
        </View>
        <Mono style={styles.heroFooter}>
          IN ${Math.round(monthIncome).toLocaleString()} / OUT ${Math.round(monthOut).toLocaleString()}
        </Mono>
      </Card>

      {/* Quick stats */}
      <View style={styles.statsGrid}>
        <StatCard icon="local_fire_department" value={`${gymStreak}`} label="Day streak" />
        <StatCard icon="military_tech" value={`${winRate}%`} label="Win rate" />
        <StatCard icon="payments" value={fmt(totalNetPnl, true)} label="P&L" positive={totalNetPnl >= 0} />
      </View>

      {/* Week consistency */}
      <Card radius={18} style={styles.weekCard}>
        <View style={styles.weekHeader}>
          <Mono style={styles.weekTitle}>This week</Mono>
          <Mono style={{ color: Colors.textMuted, fontSize: 12 }}>
            {WEEK_DONE.filter(Boolean).length} / 7 sessions
          </Mono>
        </View>
        <View style={styles.weekRow}>
          {DAY_LABELS.map((d, i) => {
            const done = WEEK_DONE[i];
            const isToday = i === TODAY_IDX;
            return (
              <View
                key={i}
                style={[
                  styles.dayCell,
                  done && styles.dayCellDone,
                  isToday && !done && styles.dayCellToday,
                  !done && !isToday && styles.dayCellRest,
                ]}
              >
                {done ? (
                  <MaterialIcons name="check" size={16} color={Colors.invertedText} />
                ) : isToday ? (
                  <MaterialIcons name="today" size={16} color={Colors.textPrimary} />
                ) : (
                  <MaterialIcons name="remove" size={14} color={Colors.textMuted} />
                )}
              </View>
            );
          })}
        </View>
        <View style={styles.weekDayLabels}>
          {DAY_LABELS.map((d, i) => (
            <Text key={i} style={styles.dayLabel}>{d}</Text>
          ))}
        </View>
      </Card>

      {/* Recent activity */}
      <View>
        <Mono style={styles.sectionLabel}>Recent activity</Mono>
        {recentActivity.map((item, i) => (
          <Card key={i} radius={14} pad={12} style={styles.activityCard}>
            <View style={styles.activityRow}>
              <View style={styles.activityIcon}>
                <MaterialIcons name={item.icon as any} size={20} color={Colors.textPrimary} />
              </View>
              <View style={styles.activityText}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activitySub}>{item.sub}</Text>
              </View>
              <Mono style={styles.activityValue}>{item.value}</Mono>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, value, label, positive }: { icon: string; value: string; label: string; positive?: boolean }) {
  const color = positive === false ? Colors.red : Colors.textPrimary;
  return (
    <Card radius={16} pad={14} style={styles.statCard}>
      <MaterialIcons name={icon as any} size={20} color={Colors.textPrimary} />
      <Mono style={[styles.statValue, { color }]}>{value}</Mono>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.ground },
  content: { padding: Spacing.screenH, paddingTop: Spacing.screenTop, paddingBottom: Spacing.screenBottom, gap: 12 },
  greeting: { gap: 4, marginBottom: 4 },
  dateHeadline: { fontSize: 26, fontWeight: '600', letterSpacing: -0.52, color: Colors.textPrimary },
  heroCard: { gap: 6 },
  heroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  heroFooter: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  statsGrid: { flexDirection: 'row', gap: Spacing.gap },
  statCard: { flex: 1, gap: 4 },
  statValue: { fontSize: 22, marginTop: 4 },
  statLabel: { fontSize: 11, color: Colors.textMuted },
  weekCard: { gap: 10 },
  weekHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  weekTitle: { fontSize: 12, color: Colors.textPrimary, textTransform: 'uppercase', letterSpacing: 1.2 },
  weekRow: { flexDirection: 'row', gap: 6 },
  dayCell: { flex: 1, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  dayCellDone: { backgroundColor: Colors.textPrimary },
  dayCellToday: { borderWidth: 1.5, borderColor: Colors.textPrimary },
  dayCellRest: { backgroundColor: 'rgba(0,0,0,0.05)' },
  weekDayLabels: { flexDirection: 'row', gap: 6 },
  dayLabel: { flex: 1, textAlign: 'center', fontSize: 10, color: Colors.textMuted, fontFamily: 'SpaceMono' },
  sectionLabel: { fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.6, marginBottom: 6 },
  activityCard: { marginBottom: 6 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  activityIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: Colors.fillSubtle, alignItems: 'center', justifyContent: 'center' },
  activityText: { flex: 1, gap: 2 },
  activityTitle: { fontSize: 14.5, fontWeight: '600', color: Colors.textPrimary },
  activitySub: { fontSize: 12, color: Colors.textMuted },
  activityValue: { fontSize: 13 },
});
