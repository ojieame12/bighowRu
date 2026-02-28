import React from 'react';
import { View, Image, StyleSheet, type ViewStyle } from 'react-native';
import { useMood } from '@/constants/MoodContext';
import { themeColors } from '@/constants/tokens';

type Props = {
  uri: string;
  size?: number;
  style?: ViewStyle;
};

export function AvatarRing({ uri, size = 64, style }: Props) {
  const { themed } = useMood();
  const ringColor = themed(themeColors.borderFocus);
  const borderWidth = 2.5;
  const innerSize = size - borderWidth * 2 - 6;
  const innerOffset = borderWidth + 3;
  const innerRadius = innerSize / 2;

  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: ringColor,
          borderWidth,
        },
        style,
      ]}
    >
      <Image
        source={{ uri }}
        style={[
          styles.avatar,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerRadius,
            top: innerOffset - borderWidth,
            left: innerOffset - borderWidth,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'relative',
  },
  avatar: {
    position: 'absolute',
  },
});
