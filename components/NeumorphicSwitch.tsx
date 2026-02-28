import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { neumorphic } from '@/constants/tokens';

type Props = {
  value: boolean;
  onValueChange: (val: boolean) => void;
};

/**
 * Large neumorphic switch – 140x56.
 * Gradient shell, two indicator wells, and a heavy knob with highlight ellipses.
 * Knob slides from x=7 (off) to x=56 (on).
 * Left indicator well turns orange when ON.
 */
export function NeumorphicSwitch({ value, onValueChange }: Props) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      friction: 9,
      tension: 50,
    }).start();
  }, [value]);

  // Knob slides from x=7 (off) to x=56 (on)
  const knobX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [7, 56],
  });

  return (
    <Pressable onPress={() => onValueChange(!value)}>
      {/* Shell: dual neumorphic shadows */}
      <View style={styles.shadowDark}>
        <View style={styles.shadowLight}>
          <LinearGradient
            colors={neumorphic.switchShell.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.shell}
          >
            {/* Left indicator well */}
            <IndicatorWell
              side="left"
              active={value}
            />

            {/* Right indicator well */}
            <IndicatorWell
              side="right"
              active={!value}
            />

            {/* Knob */}
            <Animated.View style={[styles.knobPosition, { left: knobX }]}>
              <SwitchKnob />
            </Animated.View>
          </LinearGradient>
        </View>
      </View>
    </Pressable>
  );
}

/* ── Indicator Well ── */

type WellProps = {
  side: 'left' | 'right';
  active: boolean;
};

function IndicatorWell({ side, active }: WellProps) {
  const isLeft = side === 'left';
  const borderRadius: [number, number, number, number] = isLeft
    ? [17, 0, 0, 17]
    : [0, 17, 17, 0];

  // Active indicator wells get dark inset shadows; inactive ones are the orange gradient (left) or default
  const wellGradient = isLeft && !active
    ? ['#F5B870', '#E8872E', '#D4701A', '#E07828', '#D4701A'] as const
    : (['#EBEEF2', '#9BA3AE', '#A8B0BA', '#9BA3AE'] as const);

  const wellGradientLocations = isLeft && !active
    ? [0.1, 0.3, 0.6, 0.75, 1] as const
    : [0, 0.6, 0.7, 1] as const;

  return (
    <View
      style={[
        styles.wellShadow1,
        active && styles.wellShadowActive1,
        {
          position: 'absolute',
          left: isLeft ? 14 : 70,
          top: 11,
        },
      ]}
    >
      <View style={[styles.wellShadow2, active && styles.wellShadowActive2]}>
        <LinearGradient
          colors={[...wellGradient]}
          locations={[...wellGradientLocations]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            styles.well,
            {
              borderTopLeftRadius: borderRadius[0],
              borderTopRightRadius: borderRadius[1],
              borderBottomRightRadius: borderRadius[2],
              borderBottomLeftRadius: borderRadius[3],
            },
          ]}
        />
      </View>
    </View>
  );
}

/* ── Switch Knob ── */

function SwitchKnob() {
  // 4 layered shadows from tokens
  const shadows = neumorphic.knob.shadows;

  return (
    <View style={{
      shadowColor: shadows[3].color,
      shadowOffset: { width: shadows[3].offset.x, height: shadows[3].offset.y },
      shadowOpacity: 1,
      shadowRadius: shadows[3].blur,
    }}>
      <View style={{
        shadowColor: shadows[2].color,
        shadowOffset: { width: shadows[2].offset.x, height: shadows[2].offset.y },
        shadowOpacity: 1,
        shadowRadius: shadows[2].blur,
      }}>
        <View style={{
          shadowColor: shadows[1].color,
          shadowOffset: { width: shadows[1].offset.x, height: shadows[1].offset.y },
          shadowOpacity: 1,
          shadowRadius: shadows[1].blur,
        }}>
          <View style={{
            shadowColor: shadows[0].color,
            shadowOffset: { width: shadows[0].offset.x, height: shadows[0].offset.y },
            shadowOpacity: 1,
            shadowRadius: shadows[0].blur,
          }}>
            <LinearGradient
              colors={['#EEF1F5', '#EEF1F5', '#9BA3AE']}
              locations={[0, 0.4, 0.7]}
              start={{ x: 0.7, y: 0 }}
              end={{ x: 0.2, y: 1 }}
              style={styles.knob}
            >
              {/* Highlight ellipses */}
              <LinearGradient
                colors={['#EEF1F5', '#D4D8DE']}
                start={{ x: 0.7, y: 0 }}
                end={{ x: 0.2, y: 1 }}
                style={styles.highlightLeft}
              />
              <LinearGradient
                colors={['#EEF1F5', '#B8BFC8']}
                start={{ x: 0.7, y: 0 }}
                end={{ x: 0.2, y: 1 }}
                style={styles.highlightRight}
              />
            </LinearGradient>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowDark: {
    shadowColor: '#B8BFC8',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  shadowLight: {
    shadowColor: '#F5F8FC',
    shadowOffset: { width: -5, height: -5 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  shell: {
    width: 140,
    height: 56,
    borderRadius: 28,
    position: 'relative',
  },
  /* Indicator well shadows */
  wellShadow1: {
    shadowColor: '#1A2030',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  wellShadow2: {
    shadowColor: '#1A2030',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  wellShadowActive1: {
    shadowColor: '#1A2030',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  wellShadowActive2: {
    shadowColor: '#1A2030',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  well: {
    width: 56,
    height: 34,
  },
  /* Knob */
  knobPosition: {
    position: 'absolute',
    top: 6,
  },
  knob: {
    width: 77,
    height: 45,
    borderRadius: 23,
    position: 'relative',
    overflow: 'hidden',
  },
  highlightLeft: {
    position: 'absolute',
    left: 4,
    top: 4,
    width: 32,
    height: 36,
    borderRadius: 18,
  },
  highlightRight: {
    position: 'absolute',
    left: 41,
    top: 4,
    width: 32,
    height: 36,
    borderRadius: 18,
  },
});
