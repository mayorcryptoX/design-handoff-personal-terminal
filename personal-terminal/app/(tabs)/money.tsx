import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing } from '../../constants/tokens';
import { Card } from '../../components/ui/Card';
import { Eyebrow, Mono, Title } from '../../components/ui/Typography';
import { BarChart6M } from '../../components/charts/BarChart6M';
import { useStore } from '../../lib/store';

const CATEGORY_ICONS: Record<string, string> = {
  salary: 'work',
  electricity: 'bolt',
  rent: 'home',
  groceries: 'shopping_cart',
  food: 'restaurant',
  transport: 'directions_car',
  fitness: 'fitness_center',
  subscription: 'subscriptions',
  other: 'receipt',
};

const ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Mock 6-month data (replace with real aggregation from transactions)
const MOCK_6M = [
  { label: 'Jan', income: 1159, expense: 800 },
  { label: 'Feb', income: 1159, expense: 950 },
  { label: 'Mar', income: 1159, expense: 700 },
  { label: 'Apr', income: 1159, expense: 850 },
  { label: 'May', income: 1159, expense: 780 },
  { label: 'Jun', income: 1159, expense: 634 },
];

export default function MoneyScreen() {
  const { transactions, moneyMonthIndex, setMoneyMonthIndex } = useStore();

  const now = new Date();
  const months: { label: string; year: number; month: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: `${ALL_MONTHS[d.getMonth()]} ${d.getFullYear()}`, year: d.getFullYear(), month: d.getMonth() });
  }

  const idx = Math.min(moneyMonthIndex, months.length - 1);
  const current = months[idx];
  const monthKey = `${current.year}-${String(current.month + 1).padStart(2, '0')}`;

  const monthTx = transactions.filter((t) => t.date.startsWith(monthKey));
  const income = monthTx.filter((t) => t.amountUsd > 0).reduce((s, t) => s + t.amountUsd, 0);
  const expense = Math.abs(monthTx.filter((t) => t.amountUsd < 0).reduce((s, t) => s + t.amountUsd, 0));
  const net = income - expense;
  const expPct = income > 0 ? Math.min((expense / income) * 100, 100) : 0;

  const sixMonths = MOCK_6M.map((m, i) => ({
    ...m,
    active: i === idx,
  }));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Title>Money</Title>
        <View style={styles.stepper}>
          <TouchableOpacity onPress={() => setMoneyMonthIndex(Math.max(0, idx - 1))} disabled={idx === 0}>
            <MaterialIcons name="chevron-left" size={20} color={idx === 0 ? Colors.textMuted : Colors.textSecondary} />
          </TouchableOpacity>
          <Mono style={styles.stepperLabel}>{current.label}</Mono>
          <TouchableOpacity onPress={() => setMoneyMonthIndex(Math.min(months.length - 1, idx + 1))} disabled={idx === months.length - 1}>
            <MaterialIcons name="chevron-right" size={20} color={idx === months.length - 1 ? Colors.textMuted : Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* P&L hero */}
      <Card>
        <Eyebrow>Net profit / loss</Eyebrow>
        <Text style={[styles.netValue, { color: net >= 0 ? Colors.textPrimary : Colors.red }]}>
          {net >= 0 ? '+' : ''}${Math.round(net).toLocaleString()}
        </Text>

        <View style={styles.barGroup}>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Income</Text>
            <Mono style={styles.barValue}>${Math.round(income).toLocaleString()}</Mono>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: '100%', backgroundColor: Colors.textPrimary }]} />
          </View>
        </View>

        <View style={styles.barGroup}>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Expenses</Text>
            <Mono style={[styles.barValue, { color: Colors.red }]}>${Math.round(expense).toLocaleString()}</Mono>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${expPct}%`, backgroundColor: Colors.red }]} />
          </View>
        </View>
      </Card>

      {/* 6-month trend */}
      <Card radius={18}>
        <View style={styles.trendHeader}>
          <Eyebrow>6-month trend</Eyebrow>
          <View style={styles.legend}>
            <View style={[styles.legendDot, { backgroundColor: Colors.textPrimary }]} />
            <Text style={styles.legendLabel}>In</Text>
            <View style={[styles.legendDot, { backgroundColor: Colors.red }]} />
            <Text style={styles.legendLabel}>Out</Text>
          </View>
        </View>
        <BarChart6M months={sixMonths} />
      </Card>

      {/* Transactions */}
      <Card radius={16} pad={0}>
        {monthTx.map((tx, i) => (
          <View key={tx.id} style={[styles.txRow, i < monthTx.length - 1 && styles.txDivider]}>
            <View style={styles.txIcon}>
              <MaterialIcons
                name={(CATEGORY_ICONS[tx.category] ?? 'receipt') as any}
                size={18}
                color={tx.amountUsd < 0 ? Colors.textSecondary : Colors.textPrimary}
              />
            </View>
            <View style={styles.txText}>
              <Text style={styles.txName}>{tx.name}</Text>
              <Text style={styles.txCat}>{tx.category}</Text>
            </View>
            <Mono style={[styles.txAmount, tx.amountUsd < 0 ? { color: Colors.textPrimary } : null]}>
              {tx.amountUsd < 0 ? '-' : '+'}${Math.abs(Math.round(tx.amountUsd)).toLocaleString()}
            </Mono>
          </View>
        ))}
        {monthTx.length === 0 && (
          <Text style={styles.emptyTx}>No transactions this month.</Text>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.ground },
  content: { padding: Spacing.screenH, paddingTop: Spacing.screenTop, paddingBottom: Spacing.screenBottom, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.hairlineCard, paddingHorizontal: 8, paddingVertical: 4, gap: 4 },
  stepperLabel: { fontSize: 13, minWidth: 74, textAlign: 'center' },
  netValue: { fontFamily: 'SpaceMono', fontSize: 40, fontWeight: '500', letterSpacing: -0.8, marginTop: 6, marginBottom: 12 },
  barGroup: { gap: 6, marginTop: 8 },
  barRow: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabel: { fontSize: 12, color: Colors.textMuted },
  barValue: { fontSize: 13 },
  track: { height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.08)', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  trendHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 2 },
  legendLabel: { fontSize: 11, color: Colors.textMuted },
  txRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  txDivider: { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  txIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.fillSubtle, alignItems: 'center', justifyContent: 'center' },
  txText: { flex: 1, gap: 2 },
  txName: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary },
  txCat: { fontSize: 11.5, color: Colors.textMuted, textTransform: 'capitalize' },
  txAmount: { fontFamily: 'SpaceMono', fontSize: 14 },
  emptyTx: { padding: 20, textAlign: 'center', color: Colors.textMuted },
});
