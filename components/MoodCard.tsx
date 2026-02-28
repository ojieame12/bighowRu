import React from 'react';
import { Text, StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMood } from '@/constants/MoodContext';
import { themeColors } from '@/constants/tokens';

type Props = {
  title: string;
  body: string;
  width?: number;
  style?: ViewStyle;
};

export function MoodCard({ title, body, width = 240, style }: Props) {
  const { themed } = useMood();
  const gradientStart = themed(themeColors.moodCardStart);
  const gradientEnd = themed(themeColors.moodCardEnd);
  const shadowColor = themed(themeColors.moodShadow);
  const titleColor = themed(themeColors.moodTextPrimary);
  const bodyColor = themed(themeColors.moodTextSecondary);

  return (
    <LinearGradient
      colors={[gradientStart, gradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[
        styles.card,
        {
          width,
          shadowColor,
        },
        style,
      ]}
    >
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      <Text style={[styles.body, { color: bodyColor }]}>{body}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  title: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 13,
    fontWeight: 'normal',
    lineHeight: 13 * 1.5,
  },
});
