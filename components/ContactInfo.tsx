import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';

type Props = {
  contact: string;
  style?: ViewStyle;
};

export function ContactInfo({ contact, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{contact}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontSize: 19,
    fontWeight: '600',
    color: '#90816f',
    lineHeight: 19,
    opacity: 0.45,
    fontFamily: 'SF Pro Rounded',
  },
});
