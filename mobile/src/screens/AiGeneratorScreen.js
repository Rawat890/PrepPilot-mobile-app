import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { generateAiTest } from '../store/slices/testSlice';
import PrimaryButton from '../components/PrimaryButton';
import FadeInCard from '../components/FadeInCard';
import { COLORS, SHADOWS } from '../constants/theme';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const COUNTS = [5, 10, 15];

export default function AiGeneratorScreen({ navigation }) {
  const dispatch = useDispatch();
  const { generatingAi } = useSelector((state) => state.tests);

  const [category, setCategory] = useState('Computer Science');
  const [topic, setTopic] = useState('React Native & JavaScript Closures');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState('10');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      Alert.alert('Topic Required', 'Please enter a specific exam topic.');
      return;
    }

    const res = await dispatch(
      generateAiTest({
        category,
        topic,
        difficulty,
        questionCount,
        durationMinutes: Number(durationMinutes) || 10,
      })
    );

    if (generateAiTest.fulfilled.match(res)) {
      navigation.replace('ExamScreen', { testId: res.payload._id });
    } else {
      Alert.alert('AI Error', res.payload || 'Unable to generate mock test.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={moderateScale(20)} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Groq AI Exam Builder</Text>
      </View>

      <FadeInCard style={styles.card}>
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={moderateScale(14)} color={COLORS.primary} />
          <Text style={styles.badgeText}>Powered by Groq Llama 3.3 70B</Text>
        </View>

        <Text style={styles.label}>Subject Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="e.g. Computer Science, Quantitative Aptitude"
        />

        <Text style={styles.label}>Specific Topic</Text>
        <TextInput
          style={styles.input}
          value={topic}
          onChangeText={setTopic}
          placeholder="e.g. Dynamic Programming, Profit & Loss, Indian Polity"
        />

        <Text style={styles.label}>Difficulty Level</Text>
        <View style={styles.row}>
          {DIFFICULTIES.map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => setDifficulty(level)}
              style={[styles.optionPill, difficulty === level && styles.optionPillActive]}
            >
              <Text style={[styles.optionText, difficulty === level && styles.optionTextActive]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Number of Questions</Text>
        <View style={styles.row}>
          {COUNTS.map((cnt) => (
            <TouchableOpacity
              key={cnt}
              onPress={() => setQuestionCount(cnt)}
              style={[styles.optionPill, questionCount === cnt && styles.optionPillActive]}
            >
              <Text style={[styles.optionText, questionCount === cnt && styles.optionTextActive]}>
                {cnt} Questions
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Timer Duration (Minutes)</Text>
        <TextInput
          style={styles.input}
          value={durationMinutes}
          onChangeText={setDurationMinutes}
          keyboardType="numeric"
        />

        <PrimaryButton
          title={generatingAi ? 'Generating Questions with AI...' : 'Generate & Start Exam'}
          onPress={handleGenerate}
          loading={generatingAi}
          style={{ marginTop: verticalScale(20) }}
        />
      </FadeInCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: scale(18), paddingTop: verticalScale(46) },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(18),
    gap: scale(12),
  },
  backBtn: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(20),
    padding: scale(18),
    ...SHADOWS.card,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(8),
    gap: scale(6),
    marginBottom: verticalScale(12),
  },
  badgeText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: moderateScale(12),
  },
  label: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: verticalScale(12),
    marginBottom: verticalScale(6),
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(12),
    height: verticalScale(44),
    fontSize: moderateScale(14),
    backgroundColor: '#F8FAFC',
  },
  row: {
    flexDirection: 'row',
    gap: scale(8),
  },
  optionPill: {
    flex: 1,
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  optionPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
});
