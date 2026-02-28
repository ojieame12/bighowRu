import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { neumorphic } from '@/constants/tokens';

type Props = {
  checked: boolean;
  onPress: () => void;
};

/**
 * Neumorphic checkbox – 180x180 outer frame with a 120x120 circular button.
 * Gradient direction inverts when pressed/checked. Check icon turns orange when checked.
 */
export function NeuCheck({ checked, onPress }: Props) {
  const preset = neumorphic.checkButton;

  // Gradient flips direction when checked (pressed state)
  const gradientColors: [string, string] = checked
    ? ['#D5D5D5', '#FEFEFE']
    : ['#FEFEFE', '#D5D5D5'];

  const iconColor = checked ? '#D4701A' : '#B0B0B0';

  return (
    <Pressable onPress={onPress} style={styles.outer}>
      {/* Dual neumorphic shadows need nested Views */}
      <View style={styles.shadowDark}>
        <View style={styles.shadowLight}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0.25, y: 0 }}
            end={{ x: 0.75, y: 1 }}
            style={styles.button}
          >
            <CheckIcon size={48} color={iconColor} strokeWidth={3} />
          </LinearGradient>
        </View>
      </View>
    </Pressable>
  );
}

/* ── Lucide check icon ── */

function CheckIcon({
  size,
  color,
  strokeWidth,
}: {
  size: number;
  color: string;
  strokeWidth: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6L9 17l-5-5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 180,
    height: 180,
    borderRadius: 24,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowDark: {
    shadowColor: '#C9C9C9',
    shadowOffset: { width: 16, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20,
  },
  shadowLight: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -16, height: -16 },
    shadowOpacity: 1,
    shadowRadius: 40,
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
