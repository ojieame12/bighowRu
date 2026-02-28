import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { useMood } from '@/constants/MoodContext';
import { themeColors } from '@/constants/tokens';

type Props = {
  text: string;
  style?: ViewStyle;
};

export function InputHint({ text, style }: Props) {
  const { themed } = useMood();

  return (
    <View style={[styles.container, style]}>
      <Text
        style={[
          styles.icon,
          { color: themed(themeColors.moodTextSecondary) },
        ]}
      >
        i
      </Text>
      <Text
        style={[
          styles.text,
          { color: themed(themeColors.moodTextSecondary) },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    width: 12,
    height: 12,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 12,
    opacity: 0.5,
  },
  text: {
    fontSize: 11,
    fontWeight: 'normal',
    fontFamily: 'SF Pro Rounded',
    opacity: 0.6,
  },
});
