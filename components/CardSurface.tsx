import React from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMood } from '@/constants/MoodContext';
import { themeColors } from '@/constants/tokens';

type Props = {
  children?: React.ReactNode;
  width?: number | 'auto';
  height?: number | 'auto';
  style?: ViewStyle;
};

export function CardSurface({ children, width = 200, height = 120, style }: Props) {
  const { themed } = useMood();
  const gradientStart = themed(themeColors.moodCardStart);
  const gradientEnd = themed(themeColors.moodCardEnd);
  const shadowColor = themed(themeColors.moodShadow);

  return (
    <LinearGradient
      colors={[gradientStart, gradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[
        styles.card,
        {
          width,
          height,
          shadowColor,
        },
        style,
      ]}
    >
      {children}
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
});
