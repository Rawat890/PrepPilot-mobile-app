import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../store/slices/authSlice';
import PrimaryButton from '../components/PrimaryButton';
import FadeInCard from '../components/FadeInCard';
import { COLORS, SHADOWS } from '../constants/theme';

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetExam, setTargetExam] = useState('IT Officer & Banking Exams');

  const handleRegister = () => {
    dispatch(clearAuthError());
    dispatch(registerUser({ name, email, password, targetExam }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={moderateScale(22)} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <FadeInCard style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start practicing AI-powered mock tests today</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Rohan Rawat"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Target Exam</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. GATE, Banking, SSC, UPSC"
            value={targetExam}
            onChangeText={setTargetExam}
          />

          <Text style={styles.label}>Password (min 6 chars)</Text>
          <TextInput
            style={styles.input}
            placeholder="Create password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <PrimaryButton
            title="Get Started"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: verticalScale(20) }}
          />
        </FadeInCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: scale(18), paddingTop: verticalScale(48) },
  backBtn: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(16),
    ...SHADOWS.card,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(20),
    padding: scale(20),
    ...SHADOWS.card,
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: moderateScale(13),
    color: COLORS.textSecondary,
    marginTop: verticalScale(4),
    marginBottom: verticalScale(14),
  },
  errorBox: {
    backgroundColor: COLORS.dangerLight,
    padding: scale(10),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(10),
  },
  errorText: {
    color: COLORS.danger,
    fontSize: moderateScale(12),
  },
  label: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: verticalScale(10),
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
});
