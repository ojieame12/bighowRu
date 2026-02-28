/**
 * Mood engine — positivity calculation and dynamic color interpolation.
 */

import type { Mood } from './tokens';
import { getEmoji } from './emoji-registry';

// ─── Emoji Alias Resolution ───

const EMOJI_ALIASES: Record<string, string> = { angry: 'angry-face' };

function resolveEmojiId(id: string): string {
  return EMOJI_ALIASES[id] ?? id;
}

// ─── Positivity Calculation ───

/**
 * Phase weights for the 4-phase check-in.
 * Feeling matters most, Social least.
 */
const PHASE_WEIGHTS = [0.40, 0.25, 0.20, 0.15] as const;

/**
 * Compute a single positivity score from emoji selections.
 * Weighted average of valence × intensity.
 * Returns [-1, 1].
 */
export function computePositivity(
  selections: { emojiId: string }[]
): number {
  if (selections.length === 0) return 0;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const sel of selections) {
    const entry = getEmoji(resolveEmojiId(sel.emojiId));
    if (!entry) continue;
    const weight = Math.max(entry.intensity, 0.1);
    weightedSum += entry.valence * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;
  const raw = weightedSum / totalWeight;
  return Math.max(-1, Math.min(1, raw));
}

/**
 * New weighted check-in scoring system.
 *
 * Takes 4 selections (one per phase: Feeling, Health, Energy, Social).
 * Each emoji's position in its phase (0–3) is its raw score.
 * Weighted sum → normalised 0–3 → mapped to 3 mood states.
 *
 * Floor rule: if ANY phase scores 0 (worst), result caps at moody (amber).
 *
 * Returns { score: 0–3, mood: 'bad' | 'moody' | 'great' }
 */
export function computeCheckinScore(
  phaseSelections: { emojiIndex: number }[]
): { score: number; mood: Exclude<Mood, 'neutral'> } {
  if (phaseSelections.length === 0) return { score: 0, mood: 'bad' };

  let weightedScore = 0;
  let hasFloor = false;

  for (let i = 0; i < phaseSelections.length; i++) {
    const idx = phaseSelections[i].emojiIndex; // 0-3
    const w = PHASE_WEIGHTS[i] ?? 0.15;
    weightedScore += idx * w;
    if (idx === 0) hasFloor = true;
  }

  // Normalise: max possible = 3 * 1.0 = 3
  const score = Math.min(3, weightedScore);

  // Thresholds → 3 states
  let mood: Exclude<Mood, 'neutral'>;
  if (score < 1.0) {
    mood = 'bad';
  } else if (score < 2.0) {
    mood = 'moody';
  } else {
    mood = 'great';
  }

  // Floor rule: any phase at worst → can't be great
  if (hasFloor && mood === 'great') {
    mood = 'moody';
  }

  return { score, mood };
}

// ─── Color Interpolation ───

function parseHex(hex: string): [number, number, number, number] {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const a = h.length >= 8 ? parseInt(h.substring(6, 8), 16) : 255;
  return [r, g, b, a];
}

function toHex(r: number, g: number, b: number, a: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const rr = clamp(r).toString(16).padStart(2, '0');
  const gg = clamp(g).toString(16).padStart(2, '0');
  const bb = clamp(b).toString(16).padStart(2, '0');
  if (a < 255) {
    const aa = clamp(a).toString(16).padStart(2, '0');
    return `#${rr}${gg}${bb}${aa}`;
  }
  return `#${rr}${gg}${bb}`;
}

function lerpColor(colorA: string, colorB: string, t: number): string {
  const [r1, g1, b1, a1] = parseHex(colorA);
  const [r2, g2, b2, a2] = parseHex(colorB);
  return toHex(
    r1 + (r2 - r1) * t,
    g1 + (g2 - g1) * t,
    b1 + (b2 - b1) * t,
    a1 + (a2 - a1) * t
  );
}

/** Anchor points mapping discrete moods to the positivity spectrum.
 *  neutral sits at 0 (pre-checkin default).
 *  After checkin the 3 active states are evenly spaced in positive range. */
const MOOD_ANCHORS: { mood: Mood; positivity: number }[] = [
  { mood: 'bad', positivity: -0.75 },
  { mood: 'neutral', positivity: 0.0 },
  { mood: 'moody', positivity: 0.5 },
  { mood: 'great', positivity: 1.0 },
];

/**
 * Interpolate a themed color token based on continuous positivity.
 * At exact anchor points, returns the original color exactly.
 */
export function interpolateToken(
  token: Record<Mood, string>,
  positivity: number
): string {
  const p = Math.max(-1, Math.min(1, positivity));

  for (const anchor of MOOD_ANCHORS) {
    if (p === anchor.positivity) {
      return token[anchor.mood];
    }
  }

  if (p <= MOOD_ANCHORS[0].positivity) {
    return token[MOOD_ANCHORS[0].mood];
  }
  if (p >= MOOD_ANCHORS[MOOD_ANCHORS.length - 1].positivity) {
    return token[MOOD_ANCHORS[MOOD_ANCHORS.length - 1].mood];
  }

  for (let i = 0; i < MOOD_ANCHORS.length - 1; i++) {
    const lo = MOOD_ANCHORS[i];
    const hi = MOOD_ANCHORS[i + 1];
    if (p >= lo.positivity && p <= hi.positivity) {
      const t = (p - lo.positivity) / (hi.positivity - lo.positivity);
      return lerpColor(token[lo.mood], token[hi.mood], t);
    }
  }

  return token.neutral;
}

// ─── Backward Compat ───

/** Map discrete Mood → positivity anchor value */
export const MOOD_TO_POSITIVITY: Record<Mood, number> = {
  bad: -0.75,
  neutral: 0.0,
  moody: 0.5,
  great: 1.0,
};

/** Convert continuous positivity back to nearest discrete Mood */
export function positivityToMood(positivity: number): Mood {
  if (positivity <= -0.375) return 'bad';
  if (positivity <= 0.2) return 'neutral';
  if (positivity <= 0.75) return 'moody';
  return 'great';
}

/** Convert a checkin score (0-3) to a positivity value for the theme system */
export function checkinScoreToPositivity(score: number): number {
  // 0→-0.75 (bad), 1→0 (neutral/low-moody), 2→0.5 (moody), 3→1.0 (great)
  if (score <= 1) {
    // 0-1 maps to -0.75 to 0
    return -0.75 + score * 0.75;
  }
  if (score <= 2) {
    // 1-2 maps to 0 to 0.5
    return (score - 1) * 0.5;
  }
  // 2-3 maps to 0.5 to 1.0
  return 0.5 + (score - 2) * 0.5;
}
