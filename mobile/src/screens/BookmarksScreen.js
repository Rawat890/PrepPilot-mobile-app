import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookmarks, toggleBookmark } from '../store/slices/bookmarkSlice';
import FadeInCard from '../components/FadeInCard';
import { COLORS, SHADOWS } from '../constants/theme';

export default function BookmarksScreen() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.bookmarks);

  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={() => dispatch(fetchBookmarks())} />
      }
    >
      <Text style={styles.headerTitle}>Saved Bookmarks</Text>
      <Text style={styles.headerSub}>Review tricky questions and key explanations anytime</Text>

      {items.length === 0 && !loading ? (
        <View style={styles.emptyBox}>
          <Ionicons name="bookmark-outline" size={moderateScale(44)} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No Bookmarked Questions</Text>
          <Text style={styles.emptySub}>
            Tap the bookmark icon during any mock exam to save questions here.
          </Text>
        </View>
      ) : null}

      {items.map((bm, idx) => {
        const q = bm.question;
        if (!q) return null;

        return (
          <FadeInCard key={bm._id} delay={idx * 60} style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{q.category} • {q.topic}</Text>
              </View>
              <TouchableOpacity onPress={() => dispatch(toggleBookmark({ questionId: q._id }))}>
                <Ionicons name="trash-outline" size={moderateScale(18)} color={COLORS.danger} />
              </TouchableOpacity>
            </View>

            <Text style={styles.qText}>{q.questionText}</Text>

            <View style={styles.answerBox}>
              <Text style={styles.answerLabel}>Correct Answer:</Text>
              <Text style={styles.answerText}>{q.options[q.correctOptionIndex]}</Text>
            </View>

            {q.explanation ? (
              <Text style={styles.explanation}>{q.explanation}</Text>
            ) : null}
          </FadeInCard>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: scale(18), paddingTop: verticalScale(48), paddingBottom: verticalScale(30) },
  headerTitle: { fontSize: moderateScale(22), fontWeight: '800', color: COLORS.textPrimary },
  headerSub: { fontSize: moderateScale(13), color: COLORS.textSecondary, marginTop: 2, marginBottom: verticalScale(16) },
  emptyBox: { alignItems: 'center', marginTop: verticalScale(60), paddingHorizontal: scale(20) },
  emptyTitle: { fontSize: moderateScale(17), fontWeight: '700', color: COLORS.textPrimary, marginTop: verticalScale(12) },
  emptySub: { fontSize: moderateScale(13), color: COLORS.textSecondary, textAlign: 'center', marginTop: 4 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(12),
    ...SHADOWS.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  tag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(6),
  },
  tagText: { color: COLORS.primary, fontSize: moderateScale(11), fontWeight: '700' },
  qText: { fontSize: moderateScale(14), fontWeight: '700', color: COLORS.textPrimary, marginBottom: verticalScale(10) },
  answerBox: {
    backgroundColor: COLORS.successLight,
    padding: scale(10),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(8),
  },
  answerLabel: { fontSize: moderateScale(11), fontWeight: '700', color: COLORS.success },
  answerText: { fontSize: moderateScale(13), fontWeight: '700', color: COLORS.textPrimary, marginTop: 2 },
  explanation: { fontSize: moderateScale(12), color: COLORS.textSecondary, lineHeight: moderateScale(17) },
});
