import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, type ViewStyle, type TextInputProps } from 'react-native';
import { useMood } from '@/constants/MoodContext';
import { themeColors } from '@/constants/tokens';

type InputState = 'default' | 'focus' | 'error' | 'disabled';

type Props = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  state?: InputState;
  errorMessage?: string;
  style?: ViewStyle;
} & Pick<TextInputProps, 'secureTextEntry' | 'keyboardType' | 'autoCapitalize'>;

export function InputField({
  placeholder,
  value,
  onChangeText,
  state = 'default',
  errorMessage,
  style,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: Props) {
  const { themed } = useMood();
  const [focused, setFocused] = useState(state === 'focus');

  const currentState = state === 'focus' ? 'focus' : focused ? 'focus' : state;

  const backgroundColor =
    currentState === 'focus'
      ? themed(themeColors.inputBgFocus)
      : currentState === 'disabled'
      ? '#F0EEEC'
      : currentState === 'error'
      ? themed(themeColors.errorBg)
      : themed(themeColors.inputBg);

  const borderColor =
    currentState === 'focus'
      ? themed(themeColors.borderFocus)
      : currentState === 'error'
      ? themed(themeColors.error)
      : 'transparent';

  return (
    <View style={style}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#B0A89E"
        value={value}
        onChangeText={onChangeText}
        editable={state !== 'disabled'}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          {
            backgroundColor,
            borderColor,
            borderWidth: currentState === 'focus' || currentState === 'error' ? 1.5 : 0,
            opacity: state === 'disabled' ? 0.6 : 1,
          },
        ]}
      />
      {currentState === 'error' && errorMessage && (
        <Text style={[styles.errorText, { color: themed(themeColors.error) }]}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'SF Pro Rounded',
    color: '#2b0902',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    marginLeft: 4,
  },
});
