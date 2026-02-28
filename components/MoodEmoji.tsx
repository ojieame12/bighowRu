import React from 'react';
import { Text, StyleSheet, type ViewStyle } from 'react-native';

type Props = {
  emoji: string;
  size?: number;
  style?: ViewStyle;
};

export function MoodEmoji({ emoji, size = 52, style }: Props) {
  return (
    <Text
      style={[
        styles.emoji,
        { fontSize: size, lineHeight: size * 1.1 },
        style,
      ]}
    >
      {emoji}
    </Text>
  );
}

const styles = StyleSheet.create({
  emoji: {
    textAlign: 'center',
  },
});
