import React from 'react';
import { Text, StyleSheet, type TextStyle } from 'react-native';
import { typography } from '@/constants/tokens';

type Props = {
  text?: string;
  style?: TextStyle;
};

export function OnboardingTitle({
  text = 'Stay close,\neven far apart!',
  style,
}: Props) {
  return <Text style={[styles.title, style]}>{text}</Text>;
}

const styles = StyleSheet.create({
  title: {
    width: 350,
    fontSize: typography.heading.fontSize,
    fontWeight: typography.heading.fontWeight,
    letterSpacing: typography.heading.letterSpacing,
    lineHeight: typography.heading.fontSize * typography.heading.lineHeight,
    color: '#2b0902',
    fontFamily: typography.fontFamily,
    textAlign: 'center',
  },
});
