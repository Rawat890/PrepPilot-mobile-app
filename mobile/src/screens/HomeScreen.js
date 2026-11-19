import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMockTests,
  syncOfflineQuestions,
  loadOfflineCache,
  setActiveTestOffline,
} from '../store/slices/testSlice';
import { fetchCart } from '../store/slices/cartSlice';
import FadeInCard from '../components/FadeInCard';
import { COLORS, SHADOWS } from '../constants/theme';

const CATEGORIES = ['All', 'Computer Science', 'Quantitative Aptitude', 'Logical Reasoning'];

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list, loading, offlineTests, offlineSyncedAt, syncingOffline } = useSelector(
    (state) => state.tests
  );
  const { items: cartItems } = useSelector((state) => state.cart);

  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    dispatch(fetchMockTests(selectedCategory));
    dispatch(loadOfflineCache());
    dispatch(fetchCart());
  }, [dispatch, selectedCategory]);

  const handleOfflineSync = async () => {
    const res = await dispatch(syncOfflineQuestions());
    if (syncOfflineQuestions.fulfilled.match(res)) {
      Alert.alert('Offline Ready', `Cached ${res.payload.tests.length} mock tests for offline practice.`);
    } else {
      Alert.alert('Sync Notice', 'Unable to connect to server. Using previously cached tests.');
    }
  };

  const handleOpenOfflineTest = (test) => {
    dispatch(setActiveTestOffline(test));
    navigation.navigate('ExamScreen', { testId: test._id, offlineMode: true });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.topHeader}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Aspirant'} 👋</Text>
            <Text style={styles.targetText}>{user?.targetExam || 'Competitive Exam Prep'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('CartScreen')}
            >
              <Ionicons name="cart-outline" size={moderateScale(22)} color="#FFFFFF" />
              {cartItems.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItems.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Generator Hero Banner */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.aiBanner}
          onPress={() => navigation.navigate('AiGenerator')}
        >
          <View style={styles.aiIconBox}>
            <Ionicons name="sparkles" size={moderateScale(24)} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiBannerTitle}>Generate AI Mock Test</Text>
            <Text style={styles.aiBannerSub}>
              Instant custom exams powered by Groq LLM on any topic
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={moderateScale(22)} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchMockTests(selectedCategory))}
          />
        }
      >
        {/* Offline Caching Bar */}
        <FadeInCard style={styles.offlineCard}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6) }}>
              <Ionicons name="cloud-download-outline" size={moderateScale(18)} color={COLORS.secondary} />
              <Text style={styles.offlineTitle}>Offline Question Vault</Text>
            </View>
            <Text style={styles.offlineSub}>
              {offlineTests.length > 0
                ? `${offlineTests.length} tests cached offline`
                : 'Download tests to practice without internet'}
            </Text>
          </View>
          <TouchableOpacity style={styles.syncBtn} onPress={handleOfflineSync} disabled={syncingOffline}>
            <Text style={styles.syncBtnText}>{syncingOffline ? 'Syncing...' : 'Sync Now'}</Text>
          </TouchableOpacity>
        </FadeInCard>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Available Mock Tests</Text>

        {list.map((test, index) => (
          <FadeInCard key={test._id} delay={index * 60} style={styles.testCard}>
            <View style={styles.testHeader}>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>{test.category}</Text>
              </View>
              {test.isAiGenerated && (
                <View style={styles.aiTag}>
                  <Ionicons name="sparkles" size={moderateScale(11)} color={COLORS.accent} />
                  <Text style={styles.aiTagText}>AI Generated</Text>
                </View>
              )}
            </View>

            <Text style={styles.testTitle}>{test.title}</Text>
            <Text style={styles.testDesc} numberOfLines={2}>
              {test.description}
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="help-circle-outline" size={moderateScale(15)} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>
                  {test.questionCount || test.questions?.length || 5} Qs
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={moderateScale(15)} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>{test.durationMinutes} Mins</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="speedometer-outline" size={moderateScale(15)} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>{test.difficulty}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => navigation.navigate('ExamScreen', { testId: test._id })}
            >
              <Text style={styles.startBtnText}>Start Timed Exam</Text>
              <Ionicons name="arrow-forward" size={moderateScale(16)} color="#FFFFFF" />
            </TouchableOpacity>
          </FadeInCard>
        ))}

        {/* Offline Cached Quick Access Section */}
        {offlineTests.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: verticalScale(12) }]}>
              Downloaded for Offline Practice
            </Text>
            {offlineTests.slice(0, 3).map((test) => (
              <View key={`offline-${test._id}`} style={styles.offlineItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.offlineItemTitle}>{test.title}</Text>
                  <Text style={styles.offlineItemMeta}>
                    {test.questions?.length || 0} Questions • {test.durationMinutes} Mins
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.offlinePlayBtn}
                  onPress={() => handleOpenOfflineTest(test)}
                >
                  <Text style={styles.offlinePlayText}>Start Offline</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topHeader: {
    paddingTop: verticalScale(46),
    paddingHorizontal: scale(18),
    paddingBottom: verticalScale(20),
    borderBottomLeftRadius: moderateScale(26),
    borderBottomRightRadius: moderateScale(26),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: moderateScale(21),
    fontWeight: '800',
    color: '#FFFFFF',
  },
  targetText: {
    fontSize: moderateScale(12),
    color: '#C7D2FE',
    marginTop: verticalScale(2),
  },
  headerActions: {
    flexDirection: 'row',
    gap: scale(10),
  },
  iconBtn: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: moderateScale(16),
    padding: scale(13),
    marginTop: verticalScale(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    gap: scale(12),
  },
  aiIconBox: {
    width: scale(42),
    height: scale(42),
    borderRadius: moderateScale(12),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBannerTitle: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  aiBannerSub: {
    fontSize: moderateScale(11),
    color: '#E0E7FF',
    marginTop: 2,
  },
  content: {
    padding: scale(16),
    paddingBottom: verticalScale(30),
  },
  offlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: scale(14),
    borderRadius: moderateScale(14),
    marginBottom: verticalScale(14),
    ...SHADOWS.card,
  },
  offlineTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  offlineSub: {
    fontSize: moderateScale(11),
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  syncBtn: {
    backgroundColor: '#E0F2FE',
    paddingVertical: verticalScale(7),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(8),
  },
  syncBtnText: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: moderateScale(12),
  },
  categoryScroll: {
    marginBottom: verticalScale(14),
  },
  chip: {
    paddingVertical: verticalScale(7),
    paddingHorizontal: scale(14),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.surface,
    marginRight: scale(8),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: moderateScale(17),
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: verticalScale(10),
  },
  testCard: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(12),
    ...SHADOWS.card,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  categoryPill: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(6),
  },
  categoryPillText: {
    color: COLORS.primary,
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(6),
    gap: 4,
  },
  aiTagText: {
    color: '#B45309',
    fontSize: moderateScale(10),
    fontWeight: '700',
  },
  testTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  testDesc: {
    fontSize: moderateScale(12),
    color: COLORS.textSecondary,
    marginTop: verticalScale(4),
    lineHeight: moderateScale(17),
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: verticalScale(12),
    marginBottom: verticalScale(14),
    gap: scale(16),
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  metaText: {
    fontSize: moderateScale(12),
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  startBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(10),
    gap: scale(6),
  },
  startBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: moderateScale(13),
  },
  offlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: scale(12),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(8),
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  offlineItemTitle: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  offlineItemMeta: {
    fontSize: moderateScale(11),
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  offlinePlayBtn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(7),
    borderRadius: moderateScale(8),
  },
  offlinePlayText: {
    color: '#FFFFFF',
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
});
