import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { useMood } from '@/constants/MoodContext';
import { themeColors, typography, radii } from '@/constants/tokens';
import { EmojiAsset, type EmojiName } from './EmojiAsset';

type BadgeVariant = 'default' | 'timer' | 'emojiOnly';

type Props = {
  variant?: BadgeVariant;
  label?: string;
  emojiName?: EmojiName;
  emoji?: React.ReactNode;
  timerValue?: string;
  timerSeconds?: number;
  urgent?: boolean;
  style?: ViewStyle;
};

/* ── Fixed-width digit slot ── */

function TimerDigit({ char }: { char: string }) {
  const isColon = char === ':';
  return (
    <View style={isColon ? digitStyles.colonSlot : digitStyles.digitSlot}>
      <Text style={[digitStyles.char, isColon && digitStyles.colonChar]}>
        {char}
      </Text>
    </View>
  );
}

function TimerDisplay({
  value,
  urgent,
}: {
  value: string;
  urgent?: boolean;
}) {
  // Normalize: strip spaces, ensure MM:SS format
  const clean = value.replace(/\s/g, '');
  const chars = clean.split('');

  return (
    <View style={digitStyles.row}>
      {chars.map((ch, i) => (
        <TimerDigit key={`${i}-${ch}`} char={ch} />
      ))}
    </View>
  );
}

const DIGIT_WIDTH = 14;
const COLON_WIDTH = 9;

const digitStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitSlot: {
    width: DIGIT_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colonSlot: {
    width: COLON_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  char: {
    fontFamily: typography.timer.fontFamily,
    fontSize: typography.timer.fontSize,
    fontWeight: typography.timer.fontWeight,
    color: '#56565650',
    textAlign: 'center',
  },
  colonChar: {
    marginTop: -2,
  },
});

/* ── Badge ── */

export function MoodBadge({
  variant = 'default',
  label = 'Sad',
  emojiName,
  emoji,
  timerValue = '24:98',
  timerSeconds,
  urgent,
  style,
}: Props) {
  const { themed } = useMood();
  const accentColor = themed(themeColors.accent);

  if (variant === 'timer') {
    const display =
      timerSeconds != null ? formatSeconds(timerSeconds) : timerValue;

    return (
      <View
        style={[
          styles.pill,
          styles.timerPill,
          urgent && styles.timerUrgent,
          style,
        ]}
      >
        <TimerDisplay value={display} urgent={urgent} />
      </View>
    );
  }

  const emojiContent = emoji
    ? emoji
    : emojiName
    ? <EmojiAsset name={emojiName} size={30} />
    : null;

  return (
    <View style={[styles.pill, style]}>
      <Text style={[styles.label, { color: accentColor }]}>{label}</Text>
      {emojiContent}
    </View>
  );
}

/* ── Helpers ── */

function formatSeconds(total: number): string {
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  return `${mm}:${ss}`;
}

/* ── Styles ── */

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: '#FFFFFF',
    gap: 6,
    paddingHorizontal: 12,
  },
  timerPill: {
    width: 96,
    paddingHorizontal: 0,
    gap: 0,
  },
  timerUrgent: {
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#F0808040',
  },
  label: {
    fontFamily: typography.fontFamily,
    fontSize: typography.moodLabel.fontSize,
    fontWeight: typography.moodLabel.fontWeight,
    letterSpacing: typography.moodLabel.letterSpacing,
  },
});
