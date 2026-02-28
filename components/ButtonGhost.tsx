import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, type ViewStyle } from 'react-native';
import { colors } from '@/constants/tokens';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export function ButtonGhost({ label, onPress, disabled = false, style }: Props) {
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
          backgroundColor: pressed ? colors.btnGhostPressed : 'transparent',
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: disabled ? colors.btnDisabledText : colors.btnGhostText,
          },
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
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'SF Pro Rounded',
  },
});
