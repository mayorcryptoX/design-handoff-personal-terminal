import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing } from '../../constants/tokens';
import { Card } from '../../components/ui/Card';
import { Eyebrow, Mono, Title } from '../../components/ui/Typography';
import { AreaChart } from '../../components/charts/AreaChart';
import { useStore } from '../../lib/store';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const WEEK_DONE = [true, true, false, true, true, false, false];
const TODAY_IDX = 6;

export default function GymScreen() {
  const { gymStreak, bestStreak, bodyweight, personalRecords, workouts } = useStore();

  const latestBw = bodyweight[bodyweight.length - 1]?.kg ?? 80.1;
  const firstBw = bodyweight[0]?.kg ?? 82.4;
  const bwChange = latestBw - firstBw;
  const bwData = bodyweight.map((b) => b.kg);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Title style={{ marginBottom: 4 }}>Gym</Title>

      {/* Streak hero */}
      <View style={[styles.streakCard]}>
        <View style={styles.streakTop}>
          <MaterialIcons name="local-fire-department" size={34} color={Colors.textPrimary} />
          <View>
            <Text style={styles.streakValue}>{gymStreak} days</Text>
            <Text style={styles.streakSub}>
              Current streak · {gymStreak >= bestStreak ? 'best yet!' : `best ${bestStreak}`}
            </Text>
          </View>
        </View>

        <View style={styles.weekRow}>
          {DAY_LABELS.map((d, i) => {
            const done = WEEK_DONE[i];
            const isToday = i === TODAY_IDX;
            return (
              <View key={i} style={styles.dayGroup}>
                <View
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
                <Text style={styles.dayLabel}>{d}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Bodyweight card */}
      <Card radius={18}>
        <Eyebrow>Bodyweight</Eyebrow>
        <View style={styles.bwHeader}>
          <Text style={styles.bwValue}>{latestBw.toFixed(1)} kg</Text>
          <View style={styles.bwChip}>
            <MaterialIcons
              name={bwChange <= 0 ? 'trending-down' : 'trending-up'}
              size={14}
              color={bwChange <= 0 ? Colors.textPrimary : Colors.red}
            />
            <Mono style={[styles.bwChipText, bwChange > 0 ? { color: Colors.red } : null]}>
              {bwChange >= 0 ? '+' : ''}{bwChange.toFixed(1)} kg
            </Mono>
          </View>
        </View>
        <AreaChart data={bwData} />
        <Mono style={styles.bwFooter}>Last {bwData.length} weeks</Mono>
      </Card>

      {/* PR grid */}
      <View>
        <Mono style={styles.sectionLabel}>Personal records</Mono>
        <View style={styles.prGrid}>
          {personalRecords.map((pr) => {
            const delta = pr.prevWeightKg != null ? pr.weightKg - pr.prevWeightKg : null;
            return (
              <Card key={pr.exercise} radius={16} pad={14} style={styles.prCard}>
                <Text style={styles.prName}>{pr.exercise}</Text>
                <View style={styles.prValueRow}>
                  <Mono style={styles.prValue}>{pr.weightKg}</Mono>
                  <Text style={styles.prUnit}> kg</Text>
                </View>
                {delta !== null ? (
                  <Text style={[styles.prDelta, delta === 0 && { color: Colors.textMuted }]}>
                    {delta > 0 ? `+${delta} kg` : delta === 0 ? 'no change' : `${delta} kg`}
                  </Text>
                ) : null}
                <Text style={styles.prDate}>{pr.date}</Text>
              </Card>
            );
          })}
        </View>
      </View>

      {/* Recent workouts */}
      <View>
        <Mono style={styles.sectionLabel}>Recent workouts</Mono>
        {workouts.map((w) => (
          <Card key={w.id} radius={14} pad={12} style={styles.workoutCard}>
            <View style={styles.workoutRow}>
              <View style={styles.workoutIcon}>
                <MaterialIcons name="fitness-center" size={20} color={Colors.textPrimary} />
              </View>
              <View style={styles.workoutText}>
                <Text style={styles.workoutName}>{w.name}</Text>
                <Text style={styles.workoutSub}>
                  {w.sets} sets · {(w.totalVolumeKg / 1000).toFixed(1)}k kg
                </Text>
              </View>
              <Mono style={styles.workoutDate}>{w.date.slice(5)}</Mono>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.ground },
  content: { padding: Spacing.screenH, paddingTop: Spacing.screenTop, paddingBottom: Spacing.screenBottom, gap: 12 },
  streakCard: {
    backgroundColor: Colors.gymHeroStart,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.hairlineStrong,
    padding: 20,
    gap: 16,
  },
  streakTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  streakValue: { fontFamily: 'SpaceMono', fontSize: 32, fontWeight: '500', color: Colors.textPrimary },
  streakSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  weekRow: { flexDirection: 'row', gap: 6 },
  dayGroup: { flex: 1, alignItems: 'center', gap: 4 },
  dayCell: { width: '100%', height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  dayCellDone: { backgroundColor: Colors.textPrimary },
  dayCellToday: { borderWidth: 1.5, borderColor: Colors.textPrimary },
  dayCellRest: { backgroundColor: 'rgba(0,0,0,0.05)' },
  dayLabel: { fontSize: 10, color: Colors.textMuted, fontFamily: 'SpaceMono' },
  bwHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, marginBottom: 10 },
  bwValue: { fontFamily: 'SpaceMono', fontSize: 30, fontWeight: '500', color: Colors.textPrimary },
  bwChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.fillSubtle, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  bwChipText: { fontFamily: 'SpaceMono', fontSize: 12, color: Colors.textPrimary },
  bwFooter: { fontSize: 11, color: Colors.textMuted, marginTop: 8 },
  sectionLabel: { fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.6, marginBottom: 8 },
  prGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  prCard: { width: '47.5%', gap: 4 },
  prName: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },
  prValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  prValue: { fontSize: 24, color: Colors.textPrimary },
  prUnit: { fontSize: 13, color: Colors.textMuted },
  prDelta: { fontSize: 12, color: Colors.textPrimary },
  prDate: { fontSize: 11, color: Colors.textMuted, fontFamily: 'SpaceMono', marginTop: 2 },
  workoutCard: { marginBottom: 6 },
  workoutRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  workoutIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: Colors.fillSubtle, alignItems: 'center', justifyContent: 'center' },
  workoutText: { flex: 1, gap: 2 },
  workoutName: { fontSize: 14.5, fontWeight: '600', color: Colors.textPrimary },
  workoutSub: { fontSize: 12, color: Colors.textMuted },
  workoutDate: { fontSize: 11, color: Colors.textMuted },
});
