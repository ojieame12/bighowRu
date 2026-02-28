import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, type ViewStyle } from 'react-native';
import { colors } from '@/constants/tokens';

type Props = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export function ButtonPrimaryIcon({
  label,
  icon,
  onPress,
  disabled = false,
  style,
}: Props) {
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
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 350,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: '#E0D8D0',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'SF Pro Rounded',
  },
});
