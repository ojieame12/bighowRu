import React from 'react';
import { Text, StyleSheet } from 'react-native';

type Props = {
  text: string;
};

export function InputLabel({ text }: Props) {
  return <Text style={styles.label}>{text}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C4A3D',
    letterSpacing: -0.14,
    fontFamily: 'SF Pro Rounded',
    marginBottom: 6,
  },
});
