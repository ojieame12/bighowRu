import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Platform,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Path,
} from 'react-native-svg';
import { neumorphic } from '@/constants/tokens';
import { MOOD_PHASES } from '@/constants/mood-phases';
import { computePositivity } from '@/constants/mood-engine';
import { EmojiAsset, type EmojiName } from '@/components/EmojiAsset';
import { PressGlow } from '@/components/PressGlow';

type DialMode = 'button' | 'dial' | 'summary';

type MoodSelection = { name: EmojiName; label: string; emojiIndex: number };

const PHASE_KEYS = ['feeling', 'health', 'energy', 'social'] as const;
type PhaseKey = (typeof PHASE_KEYS)[number];
type Selections = Record<PhaseKey, MoodSelection>;

type Props = {
  onComplete?: (selections: Selections, positivity: number) => void;
  onMoodSelect?: (mood: string) => void;
  onPhaseChange?: (phaseIndex: number, phaseTitle: string) => void;
  onModeChange?: (mode: 'button' | 'dial' | 'summary') => void;
  size?: number;
};

const tokens = neumorphic.moodDial;
const ARC = tokens.emojiArc;
const SUMMARY = tokens.summaryRing;
const DENT_START_ANGLE = 264; // degrees, from offset -0.08, -0.78

/* ── Sub-components ── */

export function FingerprintIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M14 13.12c0 2.38 0 6.38-1 8.88" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M2 12a10 10 0 0 1 18-6" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M2 16h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M21.8 16c.2-2 .131-5.354 0-6" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8.65 22c.21-.66.45-1.32.57-2" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M9 6.8a6 6 0 0 1 9 5.2v2" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function DialDentCircle({
  size,
  gradient,
}: {
  size: number;
  gradient: readonly [string, string];
}) {
  return (
    <Svg width={size} height={size}>
      <Defs>
        <SvgGradient id="dentGrad" x1="0.39" y1="0.42" x2="0.61" y2="1">
          <Stop offset="0.08" stopColor={gradient[0]} />
          <Stop offset="1" stopColor={gradient[1]} />
        </SvgGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#dentGrad)" />
    </Svg>
  );
}

/* ── Emoji arc position helpers ── */

function arcPosition(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  // Y-down screen coords: sin naturally gives clockwise rotation,
  // so 180→240→300→360 sweeps left→top→right (the top arc)
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
}

function angularDistance(a: number, b: number): number {
  const d = Math.abs(((a % 360) + 360) % 360 - ((b % 360) + 360) % 360);
  return Math.min(d, 360 - d);
}

/* ── Emoji Arc Item ── */

function EmojiArcItem({
  name,
  label,
  angleDeg,
  radius,
  animValue,
  highlightValue,
  allHighlights,
  index,
  scale,
}: {
  name: EmojiName;
  label: string;
  angleDeg: number;
  radius: number;
  animValue: Animated.Value;
  highlightValue: Animated.Value;
  allHighlights: Animated.Value[];
  index: number;
  scale: number;
}) {
  const pos = arcPosition(angleDeg, radius * scale);
  const emojiSize = ARC.emojiSize * scale;

  // Entry/exit
  const entryScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const entryOpacity = animValue.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.5, 1],
  });

  // Selection scale bump
  const selectScale = highlightValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });
  const labelOpacity = highlightValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const cardOpacity = highlightValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Dim when another emoji is highlighted
  // Sum all highlights, subtract ours → if >0, another is selected → dim this one
  const others = allHighlights.filter((_, i) => i !== index);
  let othersSum: Animated.AnimatedAddition<number> | Animated.Value = others[0];
  for (let j = 1; j < others.length; j++) {
    othersSum = Animated.add(othersSum, others[j]);
  }
  const dimOpacity = othersSum.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.35, 0.35],
  });

  const cardPadH = 16;
  const cardPadV = 12;
  const cardW = emojiSize + cardPadH * 2;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        transform: [
          { translateX: pos.x },
          { translateY: pos.y },
          { scale: entryScale },
        ],
        opacity: Animated.multiply(entryOpacity, dimOpacity),
        alignItems: 'center',
      }}
    >
      <Animated.View style={{ transform: [{ scale: selectScale }], alignItems: 'center' }}>
        {/* Pillowy white card — soft, wide-spread shadow */}
        <Animated.View
          style={{
            position: 'absolute',
            width: cardW,
            top: -cardPadV,
            bottom: -cardPadV,
            borderRadius: 20,
            opacity: cardOpacity,
          }}
        >
          {/* Outer diffuse shadow */}
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              borderRadius: 20,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 8 },
              shadowRadius: 24,
              shadowOpacity: 0.06,
              elevation: 4,
              backgroundColor: '#FFFFFF',
            }}
          />
          {/* Inner close shadow for depth */}
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              borderRadius: 20,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 6,
              shadowOpacity: 0.04,
              elevation: 2,
              backgroundColor: '#FFFFFF',
            }}
          />
          {/* Gradient overlay for softness */}
          <LinearGradient
            colors={['#FFFFFF', '#FDFDFD', '#F9F9F9']}
            locations={[0, 0.6, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              ...StyleSheet.absoluteFillObject,
              borderRadius: 20,
            }}
          />
        </Animated.View>
        <EmojiAsset name={name} size={emojiSize} />
        {/* Label — always rendered for layout, opacity controlled */}
        <Animated.Text
          style={{
            opacity: labelOpacity,
            marginTop: 8,
            fontSize: 11 * scale,
            fontWeight: '600',
            color: '#5C4A3D',
            textAlign: 'center',
          }}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

/* ── Summary Ring Item ── */

function SummaryRingItem({
  name,
  angleDeg,
  radius,
  animValue,
  scale,
}: {
  name: EmojiName;
  angleDeg: number;
  radius: number;
  animValue: Animated.Value;
  scale: number;
}) {
  const pos = arcPosition(angleDeg, radius * scale);

  const itemScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const itemOpacity = animValue.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.5, 1],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        transform: [
          { translateX: pos.x },
          { translateY: pos.y },
          { scale: itemScale },
        ],
        opacity: itemOpacity,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: tokens.selectedEmoji.size * scale,
          height: tokens.selectedEmoji.size * scale,
          borderRadius: tokens.selectedEmoji.radius * scale,
          overflow: 'hidden',
          shadowColor: tokens.selectedEmoji.shadow.color,
          shadowOffset: { width: 0, height: tokens.selectedEmoji.shadow.offsetY },
          shadowRadius: tokens.selectedEmoji.shadow.blur,
          shadowOpacity: tokens.selectedEmoji.shadow.opacity,
          elevation: 6,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LinearGradient
          colors={[...tokens.selectedEmoji.gradient]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <EmojiAsset name={name} size={ARC.emojiSize * scale} />
      </View>
    </Animated.View>
  );
}

/* ── Main component ── */

export function MoodDial({ onComplete, onMoodSelect, onPhaseChange, onModeChange, size = 340 }: Props) {
  const [dialMode, setDialMode] = useState<DialMode>('button');
  const [phaseIndex, setPhaseIndex] = useState(0);

  const anim = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const pressGlow = useRef(new Animated.Value(0)).current;

  // 4 reusable emoji arc animated values (reused across phases)
  const emojiAnims = useRef(
    Array.from({ length: 4 }, () => new Animated.Value(0)),
  ).current;
  const emojiHighlights = useRef(
    Array.from({ length: 4 }, () => new Animated.Value(0)),
  ).current;
  // Summary ring animated values (one per phase)
  const summaryAnims = useRef(
    Array.from({ length: MOOD_PHASES.length }, () => new Animated.Value(0)),
  ).current;

  // Mutable refs for PanResponder closures
  const dialModeRef = useRef<DialMode>('button');
  const phaseIndexRef = useRef(0);
  const busyRef = useRef(false);
  const selectionsRef = useRef<MoodSelection[]>([]);
  const highlightedRef = useRef(-1);
  const summaryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rotationDeg = useRef(0);
  const lastAngle = useRef(0);
  const totalMoved = useRef(0);
  const sizeRef = useRef(size);
  sizeRef.current = size;

  const scale = size / 340;

  // ── Find nearest emoji to dent angle ──
  const updateHighlight = useCallback((rotDeg: number) => {
    const dentAngle = ((DENT_START_ANGLE + rotDeg) % 360 + 360) % 360;
    let minDist = Infinity;
    let nearest = 0;
    for (let i = 0; i < ARC.angles.length; i++) {
      const d = angularDistance(dentAngle, ARC.angles[i]);
      if (d < minDist) {
        minDist = d;
        nearest = i;
      }
    }
    if (nearest !== highlightedRef.current) {
      const prev = highlightedRef.current;
      highlightedRef.current = nearest;
      const anims: Animated.CompositeAnimation[] = [];
      if (prev >= 0) {
        anims.push(
          Animated.timing(emojiHighlights[prev], {
            toValue: 0,
            duration: 150,
            useNativeDriver: false,
          }),
        );
      }
      anims.push(
        Animated.timing(emojiHighlights[nearest], {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      );
      Animated.parallel(anims).start();
    }
  }, [emojiHighlights]);

  // ── Animate emojis inward (from arc to center → exit) ──
  const animateEmojisOut = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      // Reset all highlights instantly
      emojiHighlights.forEach((h) => h.setValue(0));
      highlightedRef.current = -1;

      const exits = emojiAnims.map((a) =>
        Animated.timing(a, {
          toValue: 0,
          duration: ARC.exitMs,
          useNativeDriver: false,
        }),
      );
      // stagger handles the delay between each — no explicit delay per anim
      Animated.stagger(40, exits).start(() => resolve());
    });
  }, [emojiAnims, emojiHighlights]);

  // ── Animate emojis outward (from center to arc → entry) ──
  const animateEmojisIn = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      // Reset to 0 first
      emojiAnims.forEach((a) => a.setValue(0));
      emojiHighlights.forEach((h) => h.setValue(0));
      highlightedRef.current = -1;

      const entries = emojiAnims.map((a) =>
        Animated.spring(a, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: false,
        }),
      );
      // stagger handles the delay between each — no explicit delay per anim
      Animated.stagger(ARC.stagger, entries).start(() => resolve());
    });
  }, [emojiAnims, emojiHighlights]);

  // ── Expand from button to dial + show phase 1 emojis ──
  const expandToDial = useCallback(() => {
    busyRef.current = true;
    dialModeRef.current = 'dial';
    phaseIndexRef.current = 0;
    selectionsRef.current = [];
    setDialMode('dial');
    if (onModeChange) onModeChange('dial');
    setPhaseIndex(0);
    if (onPhaseChange) onPhaseChange(0, MOOD_PHASES[0].title);

    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: false,
      tension: 40,
      friction: 7,
    }).start(() => {
      animateEmojisIn().then(() => {
        busyRef.current = false;
      });
    });
  }, [anim, animateEmojisIn]);

  // ── Advance to next phase ──
  const advancePhase = useCallback(() => {
    busyRef.current = true;

    animateEmojisOut().then(() => {
      // Reset rotation
      rotationDeg.current = 0;
      rotation.setValue(0);

      const nextPhase = phaseIndexRef.current + 1;
      phaseIndexRef.current = nextPhase;
      setPhaseIndex(nextPhase);
      if (onPhaseChange) onPhaseChange(nextPhase, MOOD_PHASES[nextPhase].title);

      animateEmojisIn().then(() => {
        busyRef.current = false;
      });
    });
  }, [animateEmojisOut, animateEmojisIn, rotation]);

  // ── Show summary ring ──
  const showSummary = useCallback(() => {
    busyRef.current = true;
    dialModeRef.current = 'summary';
    setDialMode('summary');
    if (onModeChange) onModeChange('summary');

    animateEmojisOut().then(() => {
      // Reset rotation
      rotationDeg.current = 0;
      rotation.setValue(0);

      // Animate summary items in
      summaryAnims.forEach((a) => a.setValue(0));
      const entries = summaryAnims.map((a, i) =>
        Animated.spring(a, {
          toValue: 1,
          tension: 50,
          friction: 9,
          delay: i * 100,
          useNativeDriver: false,
        }),
      );
      Animated.stagger(100, entries).start(() => {
        busyRef.current = false;

        // Auto-dismiss after 2.5s
        summaryTimerRef.current = setTimeout(() => {
          dismissSummary();
        }, SUMMARY.autoDismissMs);
      });
    });
  }, [animateEmojisOut, rotation, summaryAnims]);

  // ── Dismiss summary + collapse ──
  const dismissSummary = useCallback(() => {
    if (summaryTimerRef.current) {
      clearTimeout(summaryTimerRef.current);
      summaryTimerRef.current = null;
    }

    busyRef.current = true;

    // Animate summary out
    const exits = summaryAnims.map((a) =>
      Animated.timing(a, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    );
    Animated.parallel(exits).start(() => {
      // Collapse dial back to button
      dialModeRef.current = 'button';
      setDialMode('button');
      if (onModeChange) onModeChange('button');
      phaseIndexRef.current = 0;
      setPhaseIndex(0);

      Animated.spring(anim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 40,
        friction: 7,
      }).start(() => {
        busyRef.current = false;

        // Fire onComplete with all selections + positivity
        const sels = selectionsRef.current;
        if (onComplete && sels.length === MOOD_PHASES.length) {
          const positivity = computePositivity(
            sels.map((s) => ({ emojiId: s.name }))
          );
          const [
            feeling,
            health,
            energy,
            social,
          ] = sels as [MoodSelection, MoodSelection, MoodSelection, MoodSelection];
          onComplete({ feeling, health, energy, social }, positivity);
        }
      });
    });
  }, [anim, summaryAnims, onComplete]);

  // ── Cancel flow (tap on dial with no drag) ──
  const cancelFlow = useCallback(() => {
    if (summaryTimerRef.current) {
      clearTimeout(summaryTimerRef.current);
      summaryTimerRef.current = null;
    }

    busyRef.current = true;

    // Exit any visible emojis
    const resetAnims = [
      ...emojiAnims.map((a) =>
        Animated.timing(a, { toValue: 0, duration: 150, useNativeDriver: false }),
      ),
      ...emojiHighlights.map((h) =>
        Animated.timing(h, { toValue: 0, duration: 100, useNativeDriver: false }),
      ),
    ];

    Animated.parallel(resetAnims).start(() => {
      dialModeRef.current = 'button';
      setDialMode('button');
      if (onModeChange) onModeChange('button');
      phaseIndexRef.current = 0;
      setPhaseIndex(0);
      selectionsRef.current = [];
      highlightedRef.current = -1;
      rotationDeg.current = 0;
      rotation.setValue(0);

      Animated.spring(anim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 40,
        friction: 7,
      }).start(() => {
        busyRef.current = false;
      });
    });
  }, [anim, emojiAnims, emojiHighlights, rotation]);

  // ── Rotary gesture via PanResponder ──
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) =>
        dialModeRef.current === 'dial' &&
        (Math.abs(gs.dx) > 3 || Math.abs(gs.dy) > 3),

      onPanResponderGrant: (evt) => {
        const s = sizeRef.current;
        const { locationX, locationY } = evt.nativeEvent;
        lastAngle.current = Math.atan2(
          locationY - s / 2,
          locationX - s / 2,
        );
        totalMoved.current = 0;
        Animated.timing(pressGlow, {
          toValue: 1,
          duration: 180,
          useNativeDriver: false,
        }).start();
      },

      onPanResponderMove: (evt) => {
        if (busyRef.current) return;
        if (dialModeRef.current !== 'dial') return;

        const s = sizeRef.current;
        const { locationX, locationY } = evt.nativeEvent;
        const angle = Math.atan2(
          locationY - s / 2,
          locationX - s / 2,
        );

        let delta = angle - lastAngle.current;
        if (delta > Math.PI) delta -= 2 * Math.PI;
        if (delta < -Math.PI) delta += 2 * Math.PI;

        rotationDeg.current += delta * (180 / Math.PI);
        rotation.setValue(rotationDeg.current);
        lastAngle.current = angle;
        totalMoved.current += Math.abs(delta);

        // Update emoji highlight based on dent proximity
        updateHighlight(rotationDeg.current);
      },

      onPanResponderRelease: () => {
        Animated.timing(pressGlow, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start();

        if (busyRef.current) return;

        if (totalMoved.current < 0.1) {
          // Tap
          if (dialModeRef.current === 'button') {
            expandToDial();
          } else if (dialModeRef.current === 'summary') {
            dismissSummary();
          } else if (dialModeRef.current === 'dial') {
            cancelFlow();
          }
        } else if (dialModeRef.current === 'dial') {
          // Drag release → record selection
          const idx = highlightedRef.current;
          if (idx >= 0) {
            const phase = MOOD_PHASES[phaseIndexRef.current];
            const emoji = phase.emojis[idx];
            selectionsRef.current.push({
              name: emoji.id as EmojiName,
              label: emoji.label,
              emojiIndex: idx,
            });

            // Legacy callback
            if (onMoodSelect) {
              onMoodSelect(emoji.label);
            }

            if (phaseIndexRef.current < MOOD_PHASES.length - 1) {
              advancePhase();
            } else {
              showSummary();
            }
          }
        }
      },
    }),
  ).current;

  // ── Animated interpolations (single 0→1 driver) ──

  const outerRingSize = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      tokens.outerRing.buttonSize * scale,
      tokens.outerRing.dialSize * scale,
    ],
  });

  const bodySize = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      tokens.body.buttonSize * scale,
      tokens.body.dialSize * scale,
    ],
  });

  const knobWidth = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      tokens.knob.buttonWidth * scale,
      tokens.knob.dialWidth * scale,
    ],
  });
  const knobHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      tokens.knob.buttonHeight * scale,
      tokens.knob.dialHeight * scale,
    ],
  });

  const fingerprintOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const dialDentOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const rotateStr = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'extend',
  });

  const dentSize = tokens.dialDent.dialSize * scale;
  const dentOffsetX =
    tokens.dialDent.offsetX * tokens.knob.dialWidth * scale * 0.5;
  const dentOffsetY =
    tokens.dialDent.offsetY * tokens.knob.dialHeight * scale * 0.5;

  // Current phase data
  const currentPhase = MOOD_PHASES[phaseIndex];

  return (
    <View
      style={[styles.wrapper, { width: size, height: size }]}
      {...panResponder.panHandlers}
    >
      {/* ─── Layer 0: Outer donut ring ─── */}
      <View style={[styles.layerCenter, styles.absFill]}>
        <Animated.View
          style={{
            width: outerRingSize,
            height: outerRingSize,
            borderRadius: 999,
            backgroundColor: tokens.outerRing.fill,
            opacity: tokens.outerRing.opacity,
            shadowColor: tokens.outerRing.shadow.color,
            shadowRadius: tokens.outerRing.shadow.blur,
            shadowOpacity: 1,
            shadowOffset: { width: 0, height: 0 },
            elevation: 4,
          }}
        />
      </View>

      {/* ─── Layer 1: Ambient glow ─── */}
      <View style={[styles.layerCenter, styles.absFill]}>
        <Animated.View
          style={[
            {
              width: bodySize,
              height: bodySize,
              borderRadius: 999,
              backgroundColor: tokens.ambientGlow.color,
            },
            Platform.OS === 'web'
              ? ({ filter: `blur(${tokens.ambientGlow.blur}px)` } as any)
              : undefined,
          ]}
        />
      </View>

      {/* ─── Layer 2: Body gradient ─── */}
      <View style={[styles.layerCenter, styles.absFill]}>
        <Animated.View
          style={{
            width: bodySize,
            height: bodySize,
            borderRadius: 999,
            overflow: 'hidden',
            shadowColor: tokens.body.shadow.color,
            shadowOpacity: 1,
            shadowRadius: tokens.body.shadow.blur,
            shadowOffset: { width: 0, height: 0 },
            elevation: 10,
          }}
        >
          <LinearGradient
            colors={[...tokens.body.gradient]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      {/* ─── Layer 3: Inner stroke ring ─── */}
      <View style={[styles.layerCenter, styles.absFill]} pointerEvents="none">
        <Animated.View
          style={{
            width: bodySize,
            height: bodySize,
            borderRadius: 999,
            borderWidth: tokens.strokeRing.thickness,
            borderColor: tokens.strokeRing.colors[1],
          }}
        />
      </View>

      {/* ─── Press glow ─── */}
      <View style={[styles.layerCenter, styles.absFill]} pointerEvents="none">
        <PressGlow animValue={pressGlow} width={knobWidth} height={knobHeight} />
      </View>

      {/* ─── Layer 4: Raised knob ─── */}
      <View style={[styles.layerCenter, styles.absFill]}>
        <Animated.View style={{ width: knobWidth, height: knobHeight }}>
          <View
            style={{
              flex: 1,
              borderRadius: 999,
              shadowColor: tokens.knob.shadows.dark,
              shadowOffset: {
                width: tokens.knob.shadows.offset,
                height: tokens.knob.shadows.offset,
              },
              shadowOpacity: 1,
              shadowRadius: tokens.knob.shadows.blur,
              elevation: 20,
            }}
          >
            <View
              style={{
                flex: 1,
                borderRadius: 999,
                shadowColor: tokens.knob.shadows.light,
                shadowOffset: {
                  width: -tokens.knob.shadows.offset,
                  height: -tokens.knob.shadows.offset,
                },
                shadowOpacity: 1,
                shadowRadius: tokens.knob.shadows.blur,
              }}
            >
              <LinearGradient
                colors={[...tokens.knob.gradient]}
                start={{ x: 0.25, y: 0 }}
                end={{ x: 0.75, y: 1 }}
                style={{
                  flex: 1,
                  borderRadius: 999,
                }}
              />
            </View>
          </View>
        </Animated.View>
      </View>

      {/* ─── Layer 5: Fingerprint icon ─── */}
      <Animated.View
        style={[
          styles.layerCenter,
          styles.absFill,
          { opacity: fingerprintOpacity },
        ]}
        pointerEvents="none"
      >
        <FingerprintIcon
          size={tokens.fingerprint.size * scale}
          color={tokens.fingerprint.fill}
        />
      </Animated.View>

      {/* ─── Layer 6: Dial dent ─── */}
      <Animated.View
        style={[
          styles.layerCenter,
          styles.absFill,
          {
            opacity: dialDentOpacity,
            transform: [{ rotate: rotateStr }],
          },
        ]}
        pointerEvents="none"
      >
        <View
          style={{
            transform: [
              { translateX: dentOffsetX },
              { translateY: dentOffsetY },
            ],
          }}
        >
          <DialDentCircle
            size={dentSize}
            gradient={tokens.dialDent.gradient}
          />
        </View>
      </Animated.View>

      {/* ─── Layer 7: Emoji arc ─── */}
      {dialMode === 'dial' && (
        <View style={[styles.layerCenter, styles.absFill]} pointerEvents="none">
          {currentPhase.emojis.map((emoji, i) => (
            <EmojiArcItem
              key={`${phaseIndex}-${i}`}
              name={emoji.id as EmojiName}
              label={emoji.label}
              angleDeg={ARC.angles[i]}
              radius={ARC.radius}
              animValue={emojiAnims[i]}
              highlightValue={emojiHighlights[i]}
              allHighlights={emojiHighlights}
              index={i}
              scale={scale}
            />
          ))}
        </View>
      )}

      {/* ─── Layer 8: Summary ring ─── */}
      {dialMode === 'summary' && selectionsRef.current.length === MOOD_PHASES.length && (
        <View style={[styles.layerCenter, styles.absFill]} pointerEvents="none">
          {selectionsRef.current.map((sel, i) => (
            <SummaryRingItem
              key={`summary-${i}`}
              name={sel.name}
              angleDeg={180 + i * (360 / MOOD_PHASES.length)}
              radius={SUMMARY.radius}
              animValue={summaryAnims[i]}
              scale={scale}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'visible',
  },
  absFill: {
    ...StyleSheet.absoluteFillObject,
  },
  layerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
