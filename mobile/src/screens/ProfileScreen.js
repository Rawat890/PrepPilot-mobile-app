import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, logoutUser, deleteAccount } from '../store/slices/authSlice';
import PrimaryButton from '../components/PrimaryButton';
import FadeInCard from '../components/FadeInCard';
import { COLORS, SHADOWS } from '../constants/theme';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [targetExam, setTargetExam] = useState(user?.targetExam || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSave = async () => {
    const res = await dispatch(updateProfile({ name, targetExam, phone, bio }));
    if (updateProfile.fulfilled.match(res)) {
      Alert.alert('Profile Updated', 'Your aspirant profile has been saved.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account Permanently?',
      'This will erase your profile, test history, analytics, and bookmarks forever.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: () => dispatch(deleteAccount()),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <FadeInCard style={styles.card}>
        <Text style={styles.sectionTitle}>Maintain Profile</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Target Examination</Text>
        <TextInput style={styles.input} value={targetExam} onChangeText={setTargetExam} />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Study Goal / Bio</Text>
        <TextInput
          style={[styles.input, { height: verticalScale(70), textAlignVertical: 'top', paddingTop: 10 }]}
          value={bio}
          onChangeText={setBio}
          multiline
        />

        <PrimaryButton
          title="Save Profile Changes"
          onPress={handleSave}
          loading={loading}
          style={{ marginTop: verticalScale(16) }}
        />
      </FadeInCard>

      <PrimaryButton
        title="Logout"
        variant="outline"
        onPress={() => dispatch(logoutUser())}
        style={{ marginTop: verticalScale(14) }}
      />

      <PrimaryButton
        title="Delete Account"
        variant="danger"
        onPress={handleDeleteAccount}
        style={{ marginTop: verticalScale(12), marginBottom: verticalScale(30) }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: scale(18), paddingTop: verticalScale(48) },
  profileHeader: { alignItems: 'center', marginBottom: verticalScale(18) },
  avatar: {
    width: scale(74),
    height: scale(74),
    borderRadius: scale(37),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(10),
  },
  avatarText: { color: '#FFFFFF', fontSize: moderateScale(28), fontWeight: '800' },
  userName: { fontSize: moderateScale(20), fontWeight: '800', color: COLORS.textPrimary },
  userEmail: { fontSize: moderateScale(13), color: COLORS.textSecondary, marginTop: 2 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(18),
    padding: scale(18),
    ...SHADOWS.card,
  },
  sectionTitle: { fontSize: moderateScale(16), fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  label: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: verticalScale(10),
    marginBottom: verticalScale(5),
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(12),
    height: verticalScale(42),
    fontSize: moderateScale(14),
    backgroundColor: '#F8FAFC',
  },
});
