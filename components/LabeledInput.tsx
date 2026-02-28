import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { InputField } from './InputField';
import { InputHint } from './InputHint';

type Props = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  hint?: string;
  state?: 'default' | 'focus' | 'error' | 'disabled';
  errorMessage?: string;
  style?: ViewStyle;
};

export function LabeledInput({
  placeholder,
  value,
  onChangeText,
  hint,
  state = 'default',
  errorMessage,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <InputField
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        state={state}
        errorMessage={errorMessage}
        style={styles.input}
      />
      {hint && <InputHint text={hint} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    gap: 4,
  },
  input: {
    width: '100%',
  },
});
