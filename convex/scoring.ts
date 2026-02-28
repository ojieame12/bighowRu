/**
 * Server-side scoring — direct port of constants/mood-engine.ts
 * Must stay in sync with the frontend scoring logic.
 */

const PHASE_WEIGHTS = [0.40, 0.25, 0.20, 0.15] as const;

type DiscreteMood = "bad" | "moody" | "great";

export function computeCheckinScore(
  phaseSelections: { emojiIndex: number }[]
): { score: number; mood: DiscreteMood } {
  if (phaseSelections.length === 0) return { score: 0, mood: "bad" };

  let weightedScore = 0;
  let hasFloor = false;

  for (let i = 0; i < phaseSelections.length; i++) {
    const idx = phaseSelections[i].emojiIndex;
    const w = PHASE_WEIGHTS[i] ?? 0.15;
    weightedScore += idx * w;
    if (idx === 0) hasFloor = true;
  }

  const score = Math.min(3, weightedScore);

  let mood: DiscreteMood;
  if (score < 1.0) mood = "bad";
  else if (score < 2.0) mood = "moody";
  else mood = "great";

  if (hasFloor && mood === "great") mood = "moody";

  return { score, mood };
}

export function checkinScoreToPositivity(score: number): number {
  if (score <= 1) return -0.75 + score * 0.75;
  if (score <= 2) return (score - 1) * 0.5;
  return 0.5 + (score - 2) * 0.5;
}

export function positivityToDiscreteMood(
  positivity: number
): "bad" | "neutral" | "moody" | "great" {
  if (positivity <= -0.375) return "bad";
  if (positivity <= 0.2) return "neutral";
  if (positivity <= 0.75) return "moody";
  return "great";
}
