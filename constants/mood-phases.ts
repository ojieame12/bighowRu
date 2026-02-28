/**
 * Mood phases — 5 categories, 4 emojis each (negative → positive).
 */

import type { EmojiId } from './emoji-registry';

export type PhaseEmoji = {
  id: EmojiId;
  label: string;
};

export type MoodPhase = {
  title: string;
  emojis: [PhaseEmoji, PhaseEmoji, PhaseEmoji, PhaseEmoji];
};

export const MOOD_PHASES: MoodPhase[] = [
  {
    title: 'Feeling',
    emojis: [
      { id: 'angry-face', label: 'Angry' },
      { id: 'expressionless', label: 'Fine' },
      { id: 'smile', label: 'Good' },
      { id: 'heart-eyes', label: 'Great' },
    ],
  },
  {
    title: 'Health',
    emojis: [
      { id: 'thermometer', label: 'Sick' },
      { id: 'sneezing', label: 'Sniffly' },
      { id: 'smiling-alt', label: 'Good' },
      { id: 'care', label: 'Perfect' },
    ],
  },
  {
    title: 'Energy',
    emojis: [
      { id: 'woozy', label: 'Drained' },
      { id: 'yawning', label: 'Tired' },
      { id: 'sweat-grin', label: 'Active' },
      { id: 'star-eyes', label: 'Unstoppable' },
    ],
  },
  {
    title: 'Social',
    emojis: [
      { id: 'frowning', label: 'Lonely' },
      { id: 'flushed', label: 'Awkward' },
      { id: 'halo', label: 'Grateful' },
      { id: 'smiling-hearts', label: 'Connected' },
    ],
  },
];
