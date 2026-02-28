import { Animated } from 'react-native';

type Props = {
  /** Animated value driving the glow (0 = hidden, 1 = full) */
  animValue: Animated.Value;
  /** Width of the glow shape */
  width: Animated.AnimatedInterpolation<number> | number;
  /** Height of the glow shape */
  height: Animated.AnimatedInterpolation<number> | number;
  /** Peak opacity when fully pressed (default 0.35) */
  intensity?: number;
  /** Glow color (default '#D97616') */
  color?: string;
  /** Shadow blur radius (default 24) */
  blur?: number;
};

export function PressGlow({
  animValue,
  width,
  height,
  intensity = 0.35,
  color = '#D97616',
  blur = 24,
}: Props) {
  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: 999,
        opacity: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, intensity],
        }),
        backgroundColor: `${color}50`,
        shadowColor: color,
        shadowRadius: blur,
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 0 },
      }}
    />
  );
}
