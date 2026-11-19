import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTestDetails, submitExam } from '../store/slices/testSlice';
import { toggleBookmark } from '../store/slices/bookmarkSlice';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SHADOWS } from '../constants/theme';

export default function ExamScreen({ route, navigation }) {
  const { testId, offlineMode } = route.params;
  const dispatch = useDispatch();

  const { activeTest, loading } = useSelector((state) => state.tests);
  const { items: bookmarks } = useSelector((state) => state.bookmarks);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [submitting, setSubmitting] = useState(false);

  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!offlineMode) {
      dispatch(fetchTestDetails(testId));
    }
  }, [dispatch, testId, offlineMode]);

  useEffect(() => {
    if (activeTest?.durationMinutes) {
      setSecondsLeft(activeTest.durationMinutes * 60);
      startTimeRef.current = Date.now();
    }
  }, [activeTest]);

  useEffect(() => {
    if (!activeTest) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTest]);

  if (loading || !activeTest || !activeTest.questions?.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 12, color: COLORS.textSecondary }}>Preparing Exam Hall...</Text>
      </View>
    );
  }

  const questions = activeTest.questions;
  const currentQ = questions[currentIndex];
  const isBookmarked = bookmarks.some(
    (b) => String(b.question?._id || b.question) === String(currentQ._id)
  );

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ._id]: optionIdx,
    }));
  };

  const handleFinalSubmit = async (auto = false) => {
    if (submitting) return;
    setSubmitting(true);

    const timeTakenSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const formattedAnswers = questions.map((q) => ({
      questionId: q._id,
      selectedOptionIndex: selectedAnswers[q._id] !== undefined ? selectedAnswers[q._id] : null,
    }));

    if (offlineMode) {
      // Evaluate locally if taken offline
      let correctCount = 0;
      let wrongCount = 0;
      let unansweredCount = 0;

      const evaluated = questions.map((q) => {
        const sel = selectedAnswers[q._id] !== undefined ? selectedAnswers[q._id] : null;
        let isCorrect = false;
        if (sel === null) unansweredCount++;
        else if (sel === q.correctOptionIndex) {
          correctCount++;
          isCorrect = true;
        } else wrongCount++;

        return { question: q, selectedOptionIndex: sel, isCorrect };
      });

      const offlineAttempt = {
        testTitle: activeTest.title,
        category: activeTest.category,
        score: correctCount * 4 - wrongCount,
        totalQuestions: questions.length,
        correctCount,
        wrongCount,
        unansweredCount,
        accuracy: Math.round((correctCount / questions.length) * 100),
        timeTakenSeconds,
        answers: evaluated,
      };

      setSubmitting(false);
      navigation.replace('ResultScreen', { attempt: offlineAttempt });
      return;
    }

    const res = await dispatch(
      submitExam({
        mockTestId: activeTest._id,
        answers: formattedAnswers,
        timeTakenSeconds,
      })
    );

    setSubmitting(false);
    if (submitExam.fulfilled.match(res)) {
      navigation.replace('ResultScreen', { attempt: res.payload });
    } else {
      Alert.alert('Submission Error', res.payload || 'Could not submit exam');
    }
  };

  const confirmSubmit = () => {
    Alert.alert('Submit Examination?', 'Are you sure you want to finish and view your score?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Submit Now', onPress: () => handleFinalSubmit(false) },
    ]);
  };

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* Top Timer & Progress Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={moderateScale(24)} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={[styles.timerPill, secondsLeft < 60 && { backgroundColor: COLORS.dangerLight }]}>
          <Ionicons
            name="alarm-outline"
            size={moderateScale(16)}
            color={secondsLeft < 60 ? COLORS.danger : COLORS.primary}
          />
          <Text style={[styles.timerText, secondsLeft < 60 && { color: COLORS.danger }]}>
            {formatTime(secondsLeft)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => dispatch(toggleBookmark({ questionId: currentQ._id }))}
          style={styles.bookmarkBtn}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={moderateScale(22)}
            color={isBookmarked ? COLORS.accent : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.qCounter}>
          Question {currentIndex + 1} of {questions.length} • {currentQ.topic}
        </Text>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQ.questionText}</Text>
        </View>

        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedAnswers[currentQ._id] === idx;
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.85}
              onPress={() => handleSelectOption(idx)}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
            >
              <View style={[styles.optionLetter, isSelected && styles.optionLetterSelected]}>
                <Text style={[styles.letterText, isSelected && { color: '#FFFFFF' }]}>
                  {String.fromCharCode(65 + idx)}
                </Text>
              </View>
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bottom Navigation Controls */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex((prev) => prev - 1)}
          style={[styles.navBtn, currentIndex === 0 && { opacity: 0.4 }]}
        >
          <Ionicons name="chevron-back" size={moderateScale(18)} color={COLORS.textPrimary} />
          <Text style={styles.navBtnText}>Prev</Text>
        </TouchableOpacity>

        {currentIndex < questions.length - 1 ? (
          <PrimaryButton
            title="Next Question"
            onPress={() => setCurrentIndex((prev) => prev + 1)}
            style={{ flex: 1, marginLeft: scale(12) }}
          />
        ) : (
          <PrimaryButton
            title="Submit Exam"
            onPress={confirmSubmit}
            loading={submitting}
            style={{ flex: 1, marginLeft: scale(12), backgroundColor: COLORS.success }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: verticalScale(44),
    paddingHorizontal: scale(18),
    paddingBottom: verticalScale(12),
    backgroundColor: COLORS.surface,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
    gap: scale(6),
  },
  timerText: {
    fontSize: moderateScale(15),
    fontWeight: '800',
    color: COLORS.primary,
  },
  bookmarkBtn: {
    padding: scale(4),
  },
  progressTrack: {
    height: verticalScale(4),
    backgroundColor: COLORS.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  content: {
    padding: scale(18),
    paddingBottom: verticalScale(30),
  },
  qCounter: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: verticalScale(10),
  },
  questionCard: {
    backgroundColor: COLORS.surface,
    padding: scale(18),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(16),
    ...SHADOWS.card,
  },
  questionText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: moderateScale(23),
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: scale(14),
    borderRadius: moderateScale(14),
    marginBottom: verticalScale(10),
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  optionLetter: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  optionLetterSelected: {
    backgroundColor: COLORS.primary,
  },
  letterText: {
    fontWeight: '700',
    fontSize: moderateScale(13),
    color: COLORS.textPrimary,
  },
  optionText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  optionTextSelected: {
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  navBtnText: {
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontSize: moderateScale(14),
  },
});
