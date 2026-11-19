import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../store/slices/testSlice';
import FadeInCard from '../components/FadeInCard';
import { COLORS, SHADOWS } from '../constants/theme';

export default function AnalyticsScreen() {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.tests);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const summary = analytics?.summary || {
    totalTests: 0,
    totalQuestionsSolved: 0,
    totalCorrect: 0,
    averageAccuracy: 0,
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={() => dispatch(fetchAnalytics())} />
      }
    >
      <Text style={styles.headerTitle}>Performance Analytics</Text>
      <Text style={styles.headerSub}>Track your exam accuracy, speed, and subject mastery</Text>

      {/* KPI Grid */}
      <View style={styles.grid}>
        <FadeInCard style={styles.kpiCard}>
          <Ionicons name="document-text" size={moderateScale(22)} color={COLORS.primary} />
          <Text style={styles.kpiVal}>{summary.totalTests}</Text>
          <Text style={styles.kpiLabel}>Tests Taken</Text>
        </FadeInCard>

        <FadeInCard delay={60} style={styles.kpiCard}>
          <Ionicons name="checkmark-circle" size={moderateScale(22)} color={COLORS.success} />
          <Text style={styles.kpiVal}>{summary.averageAccuracy}%</Text>
          <Text style={styles.kpiLabel}>Avg Accuracy</Text>
        </FadeInCard>

        <FadeInCard delay={120} style={styles.kpiCard}>
          <Ionicons name="help-buoy" size={moderateScale(22)} color={COLORS.secondary} />
          <Text style={styles.kpiVal}>{summary.totalQuestionsSolved}</Text>
          <Text style={styles.kpiLabel}>Questions Solved</Text>
        </FadeInCard>

        <FadeInCard delay={180} style={styles.kpiCard}>
          <Ionicons name="trophy" size={moderateScale(22)} color={COLORS.accent} />
          <Text style={styles.kpiVal}>{summary.totalCorrect}</Text>
          <Text style={styles.kpiLabel}>Correct Answers</Text>
        </FadeInCard>
      </View>

      {/* Subject Accuracy Progress Bars */}
      <Text style={styles.sectionTitle}>Subject-Wise Mastery</Text>
      <FadeInCard style={styles.card}>
        {analytics?.categoryBreakdown?.length ? (
          analytics.categoryBreakdown.map((item) => (
            <View key={item.category} style={styles.barBlock}>
              <View style={styles.barHeader}>
                <Text style={styles.barTitle}>{item.category}</Text>
                <Text style={styles.barPct}>{item.averageAccuracy}%</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${item.averageAccuracy}%` }]} />
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Attempt a mock test to unlock subject analytics.</Text>
        )}
      </FadeInCard>

      {/* Recent Attempt History */}
      <Text style={styles.sectionTitle}>Recent Exam History</Text>
      {analytics?.recentAttempts?.map((attempt) => (
        <FadeInCard key={attempt._id} style={styles.historyCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.historyTitle}>{attempt.testTitle}</Text>
            <Text style={styles.historyMeta}>
              {attempt.category} • {attempt.correctCount}/{attempt.totalQuestions} Correct
            </Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>{attempt.accuracy}%</Text>
          </View>
        </FadeInCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: scale(18), paddingTop: verticalScale(48), paddingBottom: verticalScale(30) },
  headerTitle: { fontSize: moderateScale(22), fontWeight: '800', color: COLORS.textPrimary },
  headerSub: { fontSize: moderateScale(13), color: COLORS.textSecondary, marginTop: 2, marginBottom: verticalScale(16) },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: verticalScale(10),
    marginBottom: verticalScale(18),
  },
  kpiCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(16),
    padding: scale(16),
    ...SHADOWS.card,
  },
  kpiVal: {
    fontSize: moderateScale(22),
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: verticalScale(8),
  },
  kpiLabel: {
    fontSize: moderateScale(12),
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: moderateScale(17),
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: verticalScale(10),
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(18),
    ...SHADOWS.card,
  },
  barBlock: { marginBottom: verticalScale(12) },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  barTitle: { fontSize: moderateScale(13), fontWeight: '700', color: COLORS.textPrimary },
  barPct: { fontSize: moderateScale(13), fontWeight: '700', color: COLORS.primary },
  track: { height: verticalScale(8), backgroundColor: '#E2E8F0', borderRadius: 6, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 6 },
  emptyText: { color: COLORS.textSecondary, fontSize: moderateScale(13) },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: scale(14),
    borderRadius: moderateScale(14),
    marginBottom: verticalScale(10),
    ...SHADOWS.card,
  },
  historyTitle: { fontSize: moderateScale(14), fontWeight: '700', color: COLORS.textPrimary },
  historyMeta: { fontSize: moderateScale(12), color: COLORS.textSecondary, marginTop: 2 },
  scoreBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
  },
  scoreBadgeText: { color: COLORS.primary, fontWeight: '800', fontSize: moderateScale(13) },
});
