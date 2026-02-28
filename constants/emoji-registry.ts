/**
 * Master emoji registry — every emoji has category, valence, and intensity metadata.
 * Valence: -1.0 (worst) to +1.0 (best)
 * Intensity: 0.0 (mild) to 1.0 (extreme)
 */

export type EmojiCategory = 'emotion' | 'health' | 'energy' | 'social' | 'stress';

export type EmojiEntry = {
  id: string;
  label: string;
  category: EmojiCategory;
  valence: number;
  intensity: number;
  sourceFile: string;
};

export const EMOJI_REGISTRY: Record<string, EmojiEntry> = {
  // ─── Emotion ───
  'enraged':          { id: 'enraged',          label: 'Enraged',     category: 'emotion', valence: -1.0, intensity: 1.0, sourceFile: 'Enraged Face emoji 1.svg' },
  'angry-red':        { id: 'angry-red',        label: 'Furious',     category: 'emotion', valence: -0.9, intensity: 1.0, sourceFile: '28 Angry Red Face 2.svg' },
  'loudly-crying':    { id: 'loudly-crying',    label: 'Devastated',  category: 'emotion', valence: -0.85,intensity: 0.9, sourceFile: '32 Loudly Crying Face 1.svg' },
  'angry-face':       { id: 'angry-face',       label: 'Angry',       category: 'emotion', valence: -0.8, intensity: 0.8, sourceFile: '26 Angry Face 2.svg' },
  'crying':           { id: 'crying',           label: 'Sad',         category: 'emotion', valence: -0.7, intensity: 0.7, sourceFile: '31 Crying Face 1.svg' },
  'unamused':         { id: 'unamused',         label: 'Unamused',    category: 'emotion', valence: -0.3, intensity: 0.4, sourceFile: '17 Unamused Face 1.svg' },
  'expressionless':   { id: 'expressionless',   label: 'Meh',         category: 'emotion', valence:  0.0, intensity: 0.2, sourceFile: 'Expressionless Face emoji 2.svg' },
  'smile':            { id: 'smile',            label: 'Good',        category: 'emotion', valence:  0.5, intensity: 0.4, sourceFile: '01 Smile 2.svg' },
  'smiling':          { id: 'smiling',          label: 'Happy',       category: 'emotion', valence:  0.6, intensity: 0.5, sourceFile: '02 Smiling 3.svg' },
  'grinning':         { id: 'grinning',         label: 'Great',       category: 'emotion', valence:  0.8, intensity: 0.7, sourceFile: '05 Grinning 1.svg' },
  'tears-of-joy':     { id: 'tears-of-joy',     label: 'Joyful',      category: 'emotion', valence:  0.9, intensity: 0.9, sourceFile: '06 Face with Tears of Joy 1.svg' },
  'heart-eyes':       { id: 'heart-eyes',       label: 'In Love',     category: 'emotion', valence:  1.0, intensity: 0.9, sourceFile: '14 Smiling Face with Heart-Eyes 1.svg' },

  // ─── Health ───
  'face-vomiting':    { id: 'face-vomiting',    label: 'Awful',       category: 'health',  valence: -0.9, intensity: 0.9, sourceFile: 'Face Vomiting emoji 1.svg' },
  'nauseated':        { id: 'nauseated',        label: 'Nauseous',    category: 'health',  valence: -0.7, intensity: 0.7, sourceFile: 'Nauseated Face 1.svg' },
  'thermometer':      { id: 'thermometer',      label: 'Sick',        category: 'health',  valence: -0.6, intensity: 0.6, sourceFile: 'Face with Thermometer emoji 3.svg' },
  'sneezing':         { id: 'sneezing',         label: 'Sniffly',     category: 'health',  valence: -0.4, intensity: 0.5, sourceFile: 'Sneezing Face emoji 1.svg' },
  'medical-mask':     { id: 'medical-mask',     label: 'Under Weather',category: 'health', valence: -0.3, intensity: 0.4, sourceFile: 'Face with Medical Mask 1.svg' },
  'relieved':         { id: 'relieved',         label: 'Recovering',  category: 'health',  valence:  0.4, intensity: 0.3, sourceFile: '03 Relieved 1.svg' },
  'smiling-alt':      { id: 'smiling-alt',      label: 'Healthy',     category: 'health',  valence:  0.7, intensity: 0.5, sourceFile: '04 Smiling 3.svg' },
  'care':             { id: 'care',             label: 'Thriving',    category: 'health',  valence:  0.9, intensity: 0.7, sourceFile: '24 Care Reactions 2.svg' },

  // ─── Energy ───
  'crossed-out-eyes': { id: 'crossed-out-eyes', label: 'Wiped Out',   category: 'energy',  valence: -0.9, intensity: 0.9, sourceFile: '20 Face with Crossed-Out Eyes 1.svg' },
  'woozy':            { id: 'woozy',            label: 'Drained',     category: 'energy',  valence: -0.6, intensity: 0.6, sourceFile: 'woozy emoji 3.svg' },
  'sleeping':         { id: 'sleeping',         label: 'Exhausted',   category: 'energy',  valence: -0.4, intensity: 0.5, sourceFile: 'Sleeping Face emoji 1.svg' },
  'yawning':          { id: 'yawning',          label: 'Tired',       category: 'energy',  valence: -0.2, intensity: 0.3, sourceFile: 'Yawning Face emoji 3.svg' },
  'sweat-grin':       { id: 'sweat-grin',       label: 'Pushing Through', category: 'energy', valence: 0.3, intensity: 0.5, sourceFile: '30 Grinning Face with Sweat 1.svg' },
  'grinning-squint':  { id: 'grinning-squint',  label: 'Energized',   category: 'energy',  valence:  0.7, intensity: 0.7, sourceFile: '07 Grinning Squinting Face 4.svg' },
  'star-eyes':        { id: 'star-eyes',        label: 'Unstoppable', category: 'energy',  valence:  1.0, intensity: 1.0, sourceFile: 'Grinning Face with Star Eyes emoji 1.svg' },

  // ─── Social ───
  'frowning':         { id: 'frowning',         label: 'Lonely',      category: 'social',  valence: -0.5, intensity: 0.4, sourceFile: '25 Slightly Frowning Face 1.svg' },
  'flushed':          { id: 'flushed',          label: 'Awkward',     category: 'social',  valence: -0.1, intensity: 0.5, sourceFile: '18 Flushed Face 1.svg' },
  'halo':             { id: 'halo',             label: 'Grateful',    category: 'social',  valence:  0.6, intensity: 0.5, sourceFile: 'Smiling Face with Halo emoji 1.svg' },
  'care-alt':         { id: 'care-alt',         label: 'Loved',       category: 'social',  valence:  0.8, intensity: 0.7, sourceFile: '24 Care Reactions 4.svg' },
  'smiling-hearts':   { id: 'smiling-hearts',   label: 'Connected',   category: 'social',  valence:  1.0, intensity: 0.9, sourceFile: '15 Smiling Face with Hearts 1.svg' },

  // ─── Stress ───
  'spiral-eyes':      { id: 'spiral-eyes',      label: 'Overwhelmed', category: 'stress',  valence: -0.8, intensity: 0.9, sourceFile: 'Face with Spiral Eyes emoji 1.svg' },
  'screaming':        { id: 'screaming',        label: 'Panicked',    category: 'stress',  valence: -0.7, intensity: 0.8, sourceFile: 'Face Screaming in Fear emoji 1.svg' },
  'sunglasses':       { id: 'sunglasses',       label: 'Chill',       category: 'stress',  valence:  0.7, intensity: 0.5, sourceFile: 'Smiling Face with Sunglasses 1.svg' },
} as const;

export type EmojiId = keyof typeof EMOJI_REGISTRY;

/** Get a single entry by id */
export function getEmoji(id: string): EmojiEntry | undefined {
  return EMOJI_REGISTRY[id];
}

/** Get all emojis for a given category, sorted by valence ascending */
export function emojisByCategory(category: EmojiCategory): EmojiEntry[] {
  return Object.values(EMOJI_REGISTRY)
    .filter((e) => e.category === category)
    .sort((a, b) => a.valence - b.valence);
}
