import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/tokens';

interface MonthBar {
  label: string; // e.g. "Jan"
  income: number;
  expense: number;
  active?: boolean;
}

interface BarChart6MProps {
  months: MonthBar[];
}

const CHART_HEIGHT = 120;

export function BarChart6M({ months }: BarChart6MProps) {
  const maxVal = Math.max(...months.flatMap((m) => [m.income, m.expense]), 1);

  return (
    <View style={styles.row}>
      {months.map((m, i) => {
        const incH = Math.max((m.income / maxVal) * CHART_HEIGHT, 2);
        const expH = Math.max((m.expense / maxVal) * CHART_HEIGHT, 2);
        return (
          <View key={i} style={styles.group}>
            <View style={styles.bars}>
              <View style={[styles.bar, { height: incH, backgroundColor: Colors.textPrimary }]} />
              <View style={[styles.bar, { height: expH, backgroundColor: Colors.red }]} />
            </View>
            <Text style={[styles.label, m.active && styles.labelActive]}>{m.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  group: { flex: 1, alignItems: 'center', gap: 4 },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: CHART_HEIGHT,
  },
  bar: { width: 8, borderRadius: 3 },
  label: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  labelActive: { color: Colors.textPrimary },
});
