import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStorePacks, addItemToCart, fetchCart } from '../store/slices/cartSlice';
import FadeInCard from '../components/FadeInCard';
import { COLORS, SHADOWS } from '../constants/theme';

export default function StoreScreen({ navigation }) {
  const dispatch = useDispatch();
  const { packs, items } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchStorePacks());
    dispatch(fetchCart());
  }, [dispatch]);

  const handleAdd = async (pack) => {
    await dispatch(addItemToCart(pack._id));
    Alert.alert('Added to Cart', `${pack.title} has been added to your cart.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Test Series Store</Text>
          <Text style={styles.headerSub}>Unlock full-length premium exam bundles</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('CartScreen')}>
          <Ionicons name="cart" size={moderateScale(20)} color="#FFFFFF" />
          <Text style={styles.cartBtnText}>{items.length}</Text>
        </TouchableOpacity>
      </View>

      {packs.map((pack, idx) => {
        const inCart = items.some((i) => String(i.testPack?._id) === String(pack._id));

        return (
          <FadeInCard key={pack._id} delay={idx * 70} style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.catText}>{pack.category}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pack.badge}</Text>
              </View>
            </View>

            <Text style={styles.title}>{pack.title}</Text>
            <Text style={styles.desc}>{pack.description}</Text>

            <View style={styles.stats}>
              <Text style={styles.statText}>• {pack.testCount} Mock Tests</Text>
              <Text style={styles.statText}>• {pack.questionCount}+ Questions</Text>
            </View>

            <View style={styles.bottomRow}>
              <View>
                <Text style={styles.price}>₹{pack.price}</Text>
                <Text style={styles.origPrice}>₹{pack.originalPrice}</Text>
              </View>

              <TouchableOpacity
                style={[styles.addBtn, inCart && { backgroundColor: COLORS.success }]}
                onPress={() => (inCart ? navigation.navigate('CartScreen') : handleAdd(pack))}
              >
                <Text style={styles.addBtnText}>{inCart ? 'Go to Cart' : 'Add to Cart'}</Text>
              </TouchableOpacity>
            </View>
          </FadeInCard>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: scale(18), paddingTop: verticalScale(48), paddingBottom: verticalScale(30) },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  headerTitle: { fontSize: moderateScale(22), fontWeight: '800', color: COLORS.textPrimary },
  headerSub: { fontSize: moderateScale(12), color: COLORS.textSecondary, marginTop: 2 },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    gap: scale(6),
  },
  cartBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: moderateScale(13) },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(18),
    padding: scale(16),
    marginBottom: verticalScale(14),
    ...SHADOWS.card,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: verticalScale(6) },
  catText: { color: COLORS.primary, fontWeight: '700', fontSize: moderateScale(12) },
  badge: { backgroundColor: '#FEF3C7', paddingHorizontal: scale(8), paddingVertical: 2, borderRadius: 6 },
  badgeText: { color: '#B45309', fontSize: moderateScale(10), fontWeight: '800' },
  title: { fontSize: moderateScale(16), fontWeight: '800', color: COLORS.textPrimary },
  desc: { fontSize: moderateScale(12), color: COLORS.textSecondary, marginTop: 4, lineHeight: moderateScale(17) },
  stats: { flexDirection: 'row', gap: scale(14), marginTop: verticalScale(10) },
  statText: { fontSize: moderateScale(12), fontWeight: '600', color: COLORS.textPrimary },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(14),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  price: { fontSize: moderateScale(19), fontWeight: '800', color: COLORS.textPrimary },
  origPrice: { fontSize: moderateScale(12), color: COLORS.textMuted, textDecorationLine: 'line-through' },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(10),
  },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: moderateScale(13) },
});
