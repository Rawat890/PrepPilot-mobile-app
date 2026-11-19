import React, { useRef } from 'react';
import { Animated, Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS } from '../constants/theme';

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  style,
  disabled = false,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const bgColor =
    variant === 'danger'
      ? COLORS.danger
      : variant === 'outline'
      ? 'transparent'
      : COLORS.primary;

  const textColor = variant === 'outline' ? COLORS.primary : '#FFFFFF';

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          {
            backgroundColor: bgColor,
            borderWidth: variant === 'outline' ? 1.5 : 0,
            borderColor: COLORS.primary,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: verticalScale(13),
    paddingHorizontal: scale(18),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
