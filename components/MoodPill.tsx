import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMood } from '@/constants/MoodContext';
import { themeColors } from '@/constants/tokens';
import { EmojiAsset, type EmojiName } from './EmojiAsset';

type Props = {
  emojiName: EmojiName;
  label: string;
  highlighted?: boolean;
};

export function MoodPill({ emojiName, label, highlighted = false }: Props) {
  const { themed } = useMood();
  const labelColor = themed(themeColors.moodTextSecondary);
  const accentColor = themed(themeColors.accent);
  const pillTop = themed(themeColors.surfacePrimary);
  const shadowColor = themed(themeColors.moodShadow);


  return (
    <View style={[styles.shadowOuter, { shadowColor }]}>
      <View style={[styles.shadowInner, { shadowColor }]}>
        <LinearGradient
          colors={[pillTop, 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.card}
        >
          <EmojiAsset name={emojiName} size={40} />
          <Text
            style={[
              styles.label,
              { color: highlighted ? accentColor : labelColor },
            ]}
          >
            {label}
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowOuter: {
    flex: 1,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  shadowInner: {
    flex: 1,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 10,
    gap: 6,
    borderRadius: 24,
    overflow: 'hidden',
  },
  label: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 14,
    fontWeight: '600',
  },
});
