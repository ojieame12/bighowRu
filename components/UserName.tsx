import React from 'react';
import { Text, StyleSheet, type TextStyle } from 'react-native';

type Props = {
  name: string;
  style?: TextStyle;
};

export function UserName({ name, style }: Props) {
  return <Text style={[styles.name, style]}>{name}</Text>;
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: '600',
    color: '#320903',
    letterSpacing: -0.2,
    lineHeight: 28,
    fontFamily: 'SF Pro Rounded',
  },
});
