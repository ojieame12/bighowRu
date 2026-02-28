/**
 * Design tokens extracted from howru.pen
 * Mood-based theming system with 4 mood states
 */

export type Mood = 'moody' | 'great' | 'bad' | 'neutral';

// ─── Theme-aware colors (change per mood) ───

export const themeColors = {
  accent: {
    moody: '#C4982E',
    great: '#2E8B57',
    bad: '#C43E55',
    neutral: '#787878',
  },
  borderFocus: {
    moody: '#D4B87A',
    great: '#7AD4A0',
    bad: '#D47A8E',
    neutral: '#B0B0B0',
  },
  borderSubtle: {
    moody: '#E8DFD0',
    great: '#D0E8DA',
    bad: '#E8D0D4',
    neutral: '#DEDEDE',
  },
  error: {
    moody: '#C44040',
    great: '#C44040',
    bad: '#C44040',
    neutral: '#C44040',
  },
  errorBg: {
    moody: '#FFF0F0',
    great: '#FFF0F0',
    bad: '#FFE8E8',
    neutral: '#FFF0F0',
  },
  inputBg: {
    moody: '#F5F0E8',
    great: '#EBF5EE',
    bad: '#F5EBEC',
    neutral: '#EEEEEE',
  },
  inputBgFocus: {
    moody: '#FFFFFF',
    great: '#FFFFFF',
    bad: '#FFFFFF',
    neutral: '#FFFFFF',
  },
  moodCardStart: {
    moody: '#ffffff',
    great: '#ffffff',
    bad: '#ffe4e4',
    neutral: '#ffffff',
  },
  moodCardEnd: {
    moody: '#ffe7be',
    great: '#beffd8',
    bad: '#ff9e9e',
    neutral: '#ebebeb',
  },
  moodMeshAnchor: {
    moody: '#f2c76b',
    great: '#6bf299',
    bad: '#f26b87',
    neutral: '#c4c3c4',
  },
  moodShadow: {
    moody: '#ad952a40',
    great: '#a5d0a040',
    bad: '#ad2a2a40',
    neutral: '#a7a7a740',
  },
  moodTextPrimary: {
    moody: '#320903',
    great: '#045d32',
    bad: '#5c0417',
    neutral: '#220601',
  },
  moodTextSecondary: {
    moody: '#90816f',
    great: '#94b6a6',
    bad: '#b5939a',
    neutral: '#c4c3c4',
  },
  surfacePrimary: {
    moody: '#FFFCF7',
    great: '#F8FFFA',
    bad: '#FFF8F8',
    neutral: '#FAFAFA',
  },
  surfaceSecondary: {
    moody: '#F7F1E8',
    great: '#EDF7F1',
    bad: '#F7EDEE',
    neutral: '#F0F0F0',
  },
  textDisabled: {
    moody: '#C8BCAA',
    great: '#AAC8B8',
    bad: '#C8AAB0',
    neutral: '#C0C0C0',
  },
} as const;

// ─── Static colors (same across all moods) ───

export const colors = {
  btnDisabledBg: '#F0EEEC',
  btnDisabledText: '#C0B8B0',
  btnGhostPressed: '#F5F0EC',
  btnGhostText: '#8E7060',
  btnPrimaryBg: '#3D2117',
  btnPrimaryPressed: '#2A160F',
  btnPrimaryShadow: '#3D211730',
  btnPrimaryText: '#FFFFFF',
  btnSecondaryBg: '#FFFFFF80',
  btnSecondaryBorder: '#E0D8D0',
  btnSecondaryPressed: '#F5F0EC',
  btnSecondaryText: '#5C4A3D',
} as const;

// ─── Typography ───

export const typography = {
  fontFamily: 'SF Pro Rounded',
  heading: {
    fontSize: 42,
    fontWeight: '700' as const,
    letterSpacing: -1.68,
    lineHeight: 1.08,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
    lineHeight: 1.2,
  },
  body: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 1.28,
  },
  button: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: -0.14,
  },
  moodLabel: {
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.24,
    lineHeight: 0.92,
  },
  moodCategory: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  timer: {
    fontFamily: 'Dotmax',
    fontSize: 26,
    fontWeight: 'normal' as const,
    letterSpacing: -0.28,
    lineHeight: 0.75,
  },
} as const;

// ─── Spacing & Radii ───

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radii = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 28,
  xxl: 32,
  pill: 193,
  circle: 120,
} as const;

// ─── Expanded card constants ───

export const expandedCard = {
  collapsedHeight: 220,
  expandedHeight: 450,
  expandDelta: 230,
  pillSize: 48,
  pillEmojiSize: 28,
  pillBg: '#FFFFFF',
  pillHighlightBg: '#FFF3E0',
  pillHighlightBorder: '#E8A54080',
} as const;

// ─── Neumorphic presets ───

export const neumorphic = {
  switchShell: {
    gradient: ['#D4D8DE', '#EBEEF2'],
    gradientAngle: 135,
    shadowDark: { color: '#B8BFC8', blur: 10, offset: { x: 5, y: 5 } },
    shadowLight: { color: '#F5F8FC', blur: 10, offset: { x: -5, y: -5 } },
    cornerRadius: 28,
  },
  knob: {
    gradient: ['#EEF1F5', '#EEF1F5', '#9BA3AE'],
    shadows: [
      { color: '#6B7280AA', blur: 3, offset: { x: 2, y: 2 } },
      { color: '#6B728050', blur: 6, offset: { x: 2, y: 2 } },
      { color: '#6B728050', blur: 10, offset: { x: 6, y: 10 } },
      { color: '#6B728070', blur: 20, offset: { x: 10, y: 14 } },
    ],
    cornerRadius: 23,
  },
  checkButton: {
    gradient: ['#FEFEFE', '#D5D5D5'],
    gradientAngle: 145,
    shadowDark: { color: '#C9C9C9', blur: 40, offset: { x: 16, y: 16 } },
    shadowLight: { color: '#FFFFFF', blur: 40, offset: { x: -16, y: -16 } },
    cornerRadius: 120,
  },
  moodDial: {
    outerRing: { buttonSize: 307, dialSize: 257, innerRadius: 0.131, fill: '#DADADA', opacity: 0.35, shadow: { blur: 12.6, color: '#ffe8d180' } },
    ambientGlow: { color: '#D9761650', blur: 50.8 },
    body: { buttonSize: 179, dialSize: 197, gradient: ['#D9D9D9', '#F5F5F5'], shadow: { color: '#EDE4D366', blur: 10.7 } },
    strokeRing: { colors: ['#EFEFEF', '#EAEAEA', '#E4E2E2'], thickness: 2.29 },
    knob: { gradient: ['#FEFEFE', '#F0F0F0'], angle: 145, buttonWidth: 162, buttonHeight: 170, dialWidth: 178, dialHeight: 187, shadows: { dark: '#C9C9C9', light: '#FFFFFF', blur: 40, offset: 16 } },
    fingerprint: { fill: '#563028', size: 60 },
    dialDent: { buttonSize: 23, dialSize: 25, gradient: ['#FFFFFF', '#D4D4D4'], angle: -311, offsetX: -0.08, offsetY: -0.65 },
    selectedEmoji: { size: 74, radius: 22, gradient: ['#F5F5F5', '#EBEBEB'], opacity: 0.2, shadow: { color: '#BDBDBD', offsetY: -9, blur: 36.8, opacity: 0.25 } },
    emojiArc: { radius: 170, angles: [180, 240, 300, 360], emojiSize: 40, stagger: 80, exitMs: 180 },
    summaryRing: { radius: 150, autoDismissMs: 2500 },
  },
} as const;

// ─── Re-exports for backward compat ───

export { MOOD_PHASES } from './mood-phases';

/** @deprecated Use interpolateToken from mood-engine.ts */
export function resolveColor(
  token: Record<Mood, string>,
  mood: Mood
): string {
  return token[mood];
}
