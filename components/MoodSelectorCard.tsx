import React from 'react';
import { View, Text, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMood } from '@/constants/MoodContext';
import { themeColors, typography, radii } from '@/constants/tokens';
import { EmojiAsset, type EmojiName } from './EmojiAsset';

type Props = {
  emojiName?: EmojiName;
  emoji?: React.ReactNode;
  label: string;
  category?: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function MoodSelectorCard({
  emojiName,
  emoji,
  label,
  category = 'Feeling',
  selected = false,
  onPress,
  style,
}: Props) {
  const { themed } = useMood();

  const gradientStart = themed(themeColors.moodCardStart);
  const gradientEnd = themed(themeColors.moodCardEnd);
  const shadowColor = themed(themeColors.moodShadow);
  const accentColor = themed(themeColors.accent);
  const borderSubtle = themed(themeColors.borderSubtle);
  const textPrimary = themed(themeColors.moodTextPrimary);
  const textSecondary = themed(themeColors.moodTextSecondary);
  const surfaceSecondary = themed(themeColors.surfaceSecondary);

  return (
    <Pressable onPress={onPress}>
    <LinearGradient
      colors={[gradientStart, gradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[
        styles.card,
        {
          shadowColor,
          borderColor: selected ? accentColor : borderSubtle,
          borderWidth: selected ? 2 : 1.5,
        },
        style,
      ]}
    >
      {emoji ? emoji : emojiName ? <EmojiAsset name={emojiName} size={64} /> : null}

      <Text style={[styles.label, { color: textPrimary }]}>{label}</Text>

      <View
        style={[
          styles.categoryTag,
          {
            backgroundColor: selected ? accentColor : surfaceSecondary,
          },
        ]}
      >
        <Text
          style={[
            styles.categoryText,
            {
              color: selected ? '#FFFFFF' : textSecondary,
              fontWeight: selected ? '600' : '500',
            },
          ]}
        >
          {category}
        </Text>
      </View>

      {selected && (
        <View style={[styles.checkBadge, { backgroundColor: accentColor }]}>
          <Text style={styles.checkIcon}>{'\u2713'}</Text>
        </View>
      )}
    </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 148,
    borderRadius: radii.lg,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  label: {
    fontFamily: typography.fontFamily,
    fontSize: typography.moodCategory.fontSize,
    fontWeight: typography.moodCategory.fontWeight,
    letterSpacing: typography.moodCategory.letterSpacing,
  },
  categoryTag: {
    borderRadius: 99,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontFamily: typography.fontFamily,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
});
