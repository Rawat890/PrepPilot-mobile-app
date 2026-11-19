import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeItemFromCart, checkoutCart } from '../store/slices/cartSlice';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SHADOWS } from '../constants/theme';

export default function CartScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const totalAmount = items.reduce((sum, item) => sum + (item.testPack?.price || 0), 0);

  const handleCheckout = async () => {
    const res = await dispatch(checkoutCart());
    if (checkoutCart.fulfilled.match(res)) {
      Alert.alert(
        'Order Reserved',
        res.payload.message || 'Payment gateway integration scheduled in the final phase.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={moderateScale(20)} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Study Cart</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {items.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={moderateScale(48)} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySub}>Browse test series bundles in the Store tab.</Text>
          </View>
        ) : (
          items.map((item) => {
            const pack = item.testPack;
            if (!pack) return null;

            return (
              <View key={pack._id} style={styles.itemCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{pack.title}</Text>
                  <Text style={styles.itemMeta}>{pack.testCount} Mock Tests</Text>
                  <Text style={styles.itemPrice}>₹{pack.price}</Text>
                </View>
                <TouchableOpacity onPress={() => dispatch(removeItemFromCart(pack._id))}>
                  <Ionicons name="trash-outline" size={moderateScale(20)} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{totalAmount}</Text>
          </View>
          <PrimaryButton title="Proceed to Checkout" onPress={handleCheckout} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: verticalScale(46),
    paddingHorizontal: scale(18),
    paddingBottom: verticalScale(14),
    backgroundColor: COLORS.surface,
    gap: scale(12),
  },
  backBtn: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: moderateScale(19), fontWeight: '800', color: COLORS.textPrimary },
  content: { padding: scale(18), flexGrow: 1 },
  empty: { alignItems: 'center', marginTop: verticalScale(70) },
  emptyTitle: { fontSize: moderateScale(17), fontWeight: '700', color: COLORS.textPrimary, marginTop: 10 },
  emptySub: { fontSize: moderateScale(13), color: COLORS.textSecondary, marginTop: 4 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: scale(16),
    borderRadius: moderateScale(14),
    marginBottom: verticalScale(12),
    ...SHADOWS.card,
  },
  itemTitle: { fontSize: moderateScale(15), fontWeight: '700', color: COLORS.textPrimary },
  itemMeta: { fontSize: moderateScale(12), color: COLORS.textSecondary, marginTop: 2 },
  itemPrice: { fontSize: moderateScale(16), fontWeight: '800', color: COLORS.primary, marginTop: 6 },
  footer: {
    backgroundColor: COLORS.surface,
    padding: scale(18),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  totalLabel: { fontSize: moderateScale(15), fontWeight: '600', color: COLORS.textSecondary },
  totalValue: { fontSize: moderateScale(20), fontWeight: '800', color: COLORS.textPrimary },
});
