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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../store/slices/authSlice';
import PrimaryButton from '../components/PrimaryButton';
import FadeInCard from '../components/FadeInCard';
import { COLORS, SHADOWS } from '../constants/theme';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('demo@preppilot.ai');
  const [password, setPassword] = useState('password123');
  const [secureText, setSecureText] = useState(true);

  const handleLogin = () => {
    dispatch(clearAuthError());
    dispatch(loginUser({ email, password }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={moderateScale(36)} color={COLORS.primary} />
          </View>
          <Text style={styles.brandTitle}>PrepPilot AI</Text>
          <Text style={styles.brandSubtitle}>Smart Mock Tests • Groq AI Tutor • Analytics</Text>
        </LinearGradient>

        <FadeInCard style={styles.formCard}>
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subheading}>Sign in to continue your exam preparation</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={moderateScale(18)} color={COLORS.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={moderateScale(18)} color={COLORS.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={moderateScale(18)} color={COLORS.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Ionicons
                name={secureText ? 'eye-off-outline' : 'eye-outline'}
                size={moderateScale(18)}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          <PrimaryButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: verticalScale(16) }}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </FadeInCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1 },
  header: {
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(45),
    alignItems: 'center',
    borderBottomLeftRadius: moderateScale(32),
    borderBottomRightRadius: moderateScale(32),
  },
  logoCircle: {
    width: scale(68),
    height: scale(68),
    borderRadius: scale(34),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },
  brandTitle: {
    fontSize: moderateScale(26),
    fontWeight: '800',
    color: '#FFFFFF',
  },
  brandSubtitle: {
    fontSize: moderateScale(12),
    color: '#E0E7FF',
    marginTop: verticalScale(4),
  },
  formCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: scale(18),
    marginTop: verticalScale(-24),
    borderRadius: moderateScale(20),
    padding: scale(20),
    ...SHADOWS.card,
  },
  heading: {
    fontSize: moderateScale(21),
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subheading: {
    fontSize: moderateScale(13),
    color: COLORS.textSecondary,
    marginTop: verticalScale(2),
    marginBottom: verticalScale(16),
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    padding: scale(10),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(12),
    gap: scale(8),
  },
  errorText: {
    color: COLORS.danger,
    fontSize: moderateScale(12),
    flex: 1,
  },
  label: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: verticalScale(6),
    marginTop: verticalScale(8),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(12),
    height: verticalScale(44),
    backgroundColor: '#F8FAFC',
  },
  input: {
    flex: 1,
    marginLeft: scale(8),
    fontSize: moderateScale(14),
    color: COLORS.textPrimary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(18),
  },
  footerText: {
    fontSize: moderateScale(13),
    color: COLORS.textSecondary,
  },
  linkText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: COLORS.primary,
  },
});
