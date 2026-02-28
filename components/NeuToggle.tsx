import React, { useRef, useEffect } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  value: boolean;
  onValueChange: (val: boolean) => void;
  /** Base em size in pixels. CSS original uses font-size:1.5em ≈ 24px. */
  em?: number;
};

export function NeuToggle({ value, onValueChange, em = 24 }: Props) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  // Exact CSS em ratios
  const pad = 0.125 * em;       // wrapper padding
  const trackW = 3 * em;        // track width
  const trackH = 1.5 * em;      // track height
  const trackR = 0.375 * em;    // track border-radius
  const knobS = 1.375 * em;     // knob size
  const knobR = 0.3125 * em;    // knob border-radius
  const dotS = 0.125 * em;      // dot size
  const dotG = 0.125 * em;      // dot gap

  const knobLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.0625 * em, 1.5625 * em],
  });
  const trackBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E8E8E8', '#F3B519'],
  });

  return (
    <Pressable onPress={() => onValueChange(!value)}>
      {/*
        Wrapper: background-image: linear-gradient(to bottom, #d5d5d5, #e8e8e8)
        box-shadow: 0 1px 1px rgb(255 255 255 / .6)
      */}
      <LinearGradient
        colors={['#D5D5D5', '#E8E8E8']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          borderRadius: 0.5 * em,
          padding: pad,
          shadowColor: '#FFFFFF',
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 1,
          shadowOpacity: 0.6,
          elevation: 1,
        }}
      >
        {/*
          Track: background-color: #e8e8e8
          box-shadow: inset 0 0 .0625em .125em rgb(255 255 255 / .2),
                      inset 0 .0625em .125em rgb(0 0 0 / .4)
        */}
        <Animated.View
          style={{
            width: trackW,
            height: trackH,
            borderRadius: trackR,
            backgroundColor: trackBg,
          }}
        >
          {/* Simulate inset shadows with overlays */}
          {/* Inner white glow */}
          <View
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: trackR,
              borderWidth: 0.125 * em,
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          />
          {/* Top dark inset: inset 0 .0625em .125em rgb(0 0 0 / .4) */}
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.08)', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: trackH * 0.4,
              borderTopLeftRadius: trackR,
              borderTopRightRadius: trackR,
            }}
          />
        </Animated.View>

        {/*
          Knob: background-color: #e8e8e8
          box-shadow:
            inset 0 -.0625em .0625em .125em rgb(0 0 0 / .1),   — bottom dark spread
            inset 0 -.125em .0625em rgb(0 0 0 / .2),            — bottom darker edge
            inset 0 .1875em .0625em rgb(255 255 255 / .3),      — top white highlight
            0 .125em .125em rgb(0 0 0 / .5)                     — outer drop shadow
        */}
        <Animated.View
          style={{
            position: 'absolute',
            top: pad + (trackH - knobS) / 2,
            left: Animated.add(knobLeft, pad),
            width: knobS,
            height: knobS,
            borderRadius: knobR,
          }}
        >
          {/* Outer drop shadow: 0 .125em .125em rgb(0 0 0 / .5) */}
          <View
            style={{
              position: 'absolute',
              width: knobS,
              height: knobS,
              borderRadius: knobR,
              backgroundColor: '#E8E8E8',
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 0.125 * em },
              shadowRadius: 0.125 * em,
              shadowOpacity: 0.5,
              elevation: 8,
            }}
          />

          {/* Knob body with gradient for top-lit softness */}
          <LinearGradient
            colors={['#FDFDFD', '#EEEEEE', '#E4E4E4']}
            locations={[0, 0.5, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: 'absolute',
              width: knobS,
              height: knobS,
              borderRadius: knobR,
              overflow: 'hidden',
            }}
          >
            {/* Top white highlight: inset 0 .1875em .0625em rgb(255 255 255 / .3) */}
            <LinearGradient
              colors={['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.15)', 'transparent']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: knobS * 0.45,
              }}
            />
            {/* Bottom dark edge: inset 0 -.125em .0625em rgb(0 0 0 / .2) */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.06)', 'rgba(0,0,0,0.18)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: knobS * 0.4,
              }}
            />
          </LinearGradient>

          {/* Dot grid: 4 rows × 3 cols — centered on knob */}
          <View
            style={{
              position: 'absolute',
              width: knobS,
              height: knobS,
              borderRadius: knobR,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: dotS * 3 + dotG * 2,
                gap: dotG,
              }}
            >
              {/* background-image: radial-gradient(circle at 50% 0, #f5f5f5, #c4c4c4) */}
              {Array.from({ length: 12 }).map((_, i) => (
                <LinearGradient
                  key={i}
                  colors={['#F5F5F5', '#C4C4C4']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={{
                    width: dotS,
                    height: dotS,
                    borderRadius: dotS / 2,
                  }}
                />
              ))}
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </Pressable>
  );
}
