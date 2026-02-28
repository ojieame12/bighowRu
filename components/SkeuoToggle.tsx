import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  value: boolean;
  onValueChange: (val: boolean) => void;
};

/** Small skeuomorphic toggle – 52x28, rounded-rect track with a grip-dot knob. */
export function SkeuoToggle({ value, onValueChange }: Props) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
      tension: 60,
    }).start();
  }, [value]);

  // Knob slides from x=3 (off) to x=27 (on)
  const knobX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 27],
  });

  // Track color: #F5F5F5 (off) -> #f3b519 (on)
  const trackBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F5F5F5', '#f3b519'],
  });

  return (
    <Pressable onPress={() => onValueChange(!value)}>
      {/* Outer shell: gradient + outer glow shadow */}
      <View style={styles.outerShadow}>
        <LinearGradient
          colors={['#E8E8E8', '#F5F5F5']}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.shell}
        >
          {/* Track */}
          <Animated.View
            style={[
              styles.track,
              { backgroundColor: trackBg },
            ]}
          >
            {/* Track inner shadow (top edge) */}
            <View style={styles.trackInnerShadow} />
          </Animated.View>

          {/* Knob */}
          <Animated.View style={[styles.knobOuter, { left: knobX }]}>
            <View style={styles.knobShadow2}>
              <View style={styles.knobShadow1}>
                <LinearGradient
                  colors={['#FFFFFF', '#F0F0F0']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.knob}
                >
                  {/* Grip dots: 3x4 grid */}
                  <View style={styles.gripGrid}>
                    {[0, 1, 2].map((col) => (
                      <View key={col} style={styles.gripCol}>
                        {[0, 1, 2, 3].map((row) => (
                          <View key={row} style={styles.gripDot} />
                        ))}
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outerShadow: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 2,
  },
  shell: {
    width: 52,
    height: 28,
    borderRadius: 8,
    position: 'relative',
  },
  track: {
    position: 'absolute',
    left: 2,
    top: 2,
    width: 48,
    height: 24,
    borderRadius: 6,
    overflow: 'hidden',
  },
  trackInnerShadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
  },
  knobOuter: {
    position: 'absolute',
    top: 3,
  },
  knobShadow2: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.19,
    shadowRadius: 4,
  },
  knobShadow1: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gripGrid: {
    flexDirection: 'row',
    gap: 2,
  },
  gripCol: {
    gap: 2,
  },
  gripDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#C0C0C0',
  },
});
