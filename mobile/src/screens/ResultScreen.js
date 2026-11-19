import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import apiClient from '../api/client';
import PrimaryButton from '../components/PrimaryButton';
import FadeInCard from '../components/FadeInCard';
import { COLORS, SHADOWS } from '../constants/theme';

export default function ResultScreen({ route, navigation }) {
  const { attempt } = route.params;
  const [aiExplanations, setAiExplanations] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const handleAskGroqTutor = async (question, selectedOptionIndex) => {
    const qId = question._id;
    if (aiExplanations[qId]) return;

    setLoadingId(qId);
    try {
      const { data } = await apiClient.post('/tests/ai-explain', {
        questionId: qId,
        userSelectedIndex: selectedOptionIndex,
      });
      setAiExplanations((prev) => ({ ...prev, [qId]: data.explanation }));
    } catch {
      setAiExplanations((prev) => ({
        ...prev,
        [qId]: question.explanation || 'Unable to reach AI tutor offline.',
      }));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.scoreCard}>
        <Text style={styles.resultLabel}>EXAMINATION COMPLETED</Text>
        <Text style={styles.testTitle}>{attempt.testTitle}</Text>

        <View style={styles.accuracyCircle}>
          <Text style={styles.accuracyNumber}>{attempt.accuracy}%</Text>
          <Text style={styles.accuracySub}>Accuracy</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{attempt.score}</Text>
            <Text style={styles.statKey}>Score</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: '#6EE7B7' }]}>{attempt.correctCount}</Text>
            <Text style={styles.statKey}>Correct</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: '#FCA5A5' }]}>{attempt.wrongCount}</Text>
            <Text style={styles.statKey}>Wrong</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{attempt.unansweredCount}</Text>
            <Text style={styles.statKey}>Skipped</Text>
          </View>
        </View>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Question-by-Question Review</Text>

      {attempt.answers?.map((item, idx) => {
        const q = item.question;
        if (!q) return null;

        const isCorrect = item.isCorrect;
        const userAnsText =
          item.selectedOptionIndex !== null && item.selectedOptionIndex !== undefined
            ? q.options[item.selectedOptionIndex]
            : 'Not Answered';
        const correctAnsText = q.options[q.correctOptionIndex];

        return (
          <FadeInCard key={idx} delay={idx * 60} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.qNum}>Question {idx + 1}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: isCorrect ? COLORS.successLight : COLORS.dangerLight },
                ]}
              >
                <Text
                  style={{
                    color: isCorrect ? COLORS.success : COLORS.danger,
                    fontWeight: '700',
                    fontSize: moderateScale(11),
                  }}
                >
                  {isCorrect ? 'Correct (+4)' : item.selectedOptionIndex === null ? 'Skipped (0)' : 'Wrong (-1)'}
                </Text>
              </View>
            </View>

            <Text style={styles.qText}>{q.questionText}</Text>

            <Text style={styles.ansLine}>
              <Text style={{ fontWeight: '700' }}>Your Answer: </Text>
              <Text style={{ color: isCorrect ? COLORS.success : COLORS.danger }}>{userAnsText}</Text>
            </Text>

            <Text style={styles.ansLine}>
              <Text style={{ fontWeight: '700' }}>Correct Answer: </Text>
              <Text style={{ color: COLORS.success, fontWeight: '700' }}>{correctAnsText}</Text>
            </Text>

            {q.explanation ? (
              <View style={styles.baseExpBox}>
                <Text style={styles.baseExpText}>{q.explanation}</Text>
              </View>
            ) : null}

            {/* AI Tutor Deep Explanation */}
            <TouchableOpacity
              style={styles.aiExplainBtn}
              onPress={() => handleAskGroqTutor(q, item.selectedOptionIndex)}
            >
              <Ionicons name="sparkles" size={moderateScale(15)} color={COLORS.primary} />
              <Text style={styles.aiExplainBtnText}>
                {aiExplanations[q._id] ? 'Groq AI Tutor Breakdown' : 'Ask Groq AI Tutor Why'}
              </Text>
            </TouchableOpacity>

            {loadingId === q._id && (
              <ActivityIndicator style={{ marginTop: 8 }} color={COLORS.primary} />
            )}

            {aiExplanations[q._id] ? (
              <View style={styles.aiResponseBox}>
                <Text style={styles.aiResponseText}>{aiExplanations[q._id]}</Text>
              </View>
            ) : null}
          </FadeInCard>
        );
      })}

      <PrimaryButton
        title="Back to Dashboard"
        onPress={() => navigation.navigate('MainTabs')}
        style={{ marginTop: verticalScale(10), marginBottom: verticalScale(30) }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: scale(16), paddingTop: verticalScale(44) },
  scoreCard: {
    borderRadius: moderateScale(22),
    padding: scale(20),
    alignItems: 'center',
    marginBottom: verticalScale(18),
  },
  resultLabel: {
    color: '#C7D2FE',
    fontSize: moderateScale(11),
    fontWeight: '800',
    letterSpacing: 1,
  },
  testTitle: {
    color: '#FFFFFF',
    fontSize: moderateScale(18),
    fontWeight: '800',
    textAlign: 'center',
    marginTop: verticalScale(4),
  },
  accuracyCircle: {
    width: scale(104),
    height: scale(104),
    borderRadius: scale(52),
    borderWidth: 5,
    borderColor: '#A5B4FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(16),
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  accuracyNumber: {
    color: '#FFFFFF',
    fontSize: moderateScale(24),
    fontWeight: '800',
  },
  accuracySub: {
    color: '#E0E7FF',
    fontSize: moderateScale(11),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(10),
  },
  statBox: { alignItems: 'center' },
  statVal: { color: '#FFFFFF', fontSize: moderateScale(17), fontWeight: '800' },
  statKey: { color: '#C7D2FE', fontSize: moderateScale(11) },
  sectionTitle: {
    fontSize: moderateScale(17),
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: verticalScale(10),
  },
  reviewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(12),
    ...SHADOWS.card,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  qNum: { fontWeight: '800', color: COLORS.primary, fontSize: moderateScale(13) },
  statusBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(6),
  },
  qText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: verticalScale(8),
  },
  ansLine: {
    fontSize: moderateScale(13),
    color: COLORS.textSecondary,
    marginBottom: verticalScale(4),
  },
  baseExpBox: {
    backgroundColor: '#F8FAFC',
    padding: scale(10),
    borderRadius: moderateScale(8),
    marginTop: verticalScale(6),
  },
  baseExpText: {
    fontSize: moderateScale(12),
    color: COLORS.textSecondary,
    lineHeight: moderateScale(17),
  },
  aiExplainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(10),
    gap: scale(6),
  },
  aiExplainBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: moderateScale(13),
  },
  aiResponseBox: {
    backgroundColor: COLORS.primaryLight,
    padding: scale(12),
    borderRadius: moderateScale(10),
    marginTop: verticalScale(8),
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  aiResponseText: {
    fontSize: moderateScale(12),
    color: COLORS.textPrimary,
    lineHeight: moderateScale(18),
  },
});
