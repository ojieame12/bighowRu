import React from 'react';
import { Text, StyleSheet, type TextStyle } from 'react-native';
import { typography } from '@/constants/tokens';

type Props = {
  text?: string;
  style?: TextStyle;
};

export function OnboardingBody({
  text = 'A quiet connection with the people who matter! No awkward calls, just peace of mind.',
  style,
}: Props) {
  return <Text style={[styles.body, style]}>{text}</Text>;
}

const styles = StyleSheet.create({
  body: {
    width: 288,
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    lineHeight: typography.body.fontSize * typography.body.lineHeight,
    color: '#8c827e',
    fontFamily: typography.fontFamily,
    textAlign: 'center',
  },
});
