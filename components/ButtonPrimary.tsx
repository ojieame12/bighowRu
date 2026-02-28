import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, type ViewStyle } from 'react-native';
import { colors } from '@/constants/tokens';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export function ButtonPrimary({ label, onPress, disabled = false, style }: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.button,
        {
          backgroundColor: disabled
            ? colors.btnDisabledBg
            : pressed
            ? colors.btnPrimaryPressed
            : colors.btnPrimaryBg,
          shadowColor: disabled ? 'transparent' : colors.btnPrimaryShadow,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: disabled ? colors.btnDisabledText : colors.btnPrimaryText },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'SF Pro Rounded',
  },
});
