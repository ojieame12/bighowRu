import React from 'react';
import { View, type ViewStyle } from 'react-native';
import SVG_EMOJI_MAP from '@/assets/emojis';

export type EmojiName =
  // Emotion
  | 'smile'
  | 'smiling'
  | 'smiling-alt'
  | 'grinning'
  | 'grinning-squint'
  | 'tears-of-joy'
  | 'heart-eyes'
  | 'care'
  | 'care-alt'
  | 'angry-face'
  | 'angry-red'
  | 'enraged'
  | 'expressionless'
  | 'unamused'
  | 'crying'
  | 'loudly-crying'
  // Health
  | 'thermometer'
  | 'face-vomiting'
  | 'nauseated'
  | 'sneezing'
  | 'medical-mask'
  | 'relieved'
  // Energy
  | 'yawning'
  | 'woozy'
  | 'sleeping'
  | 'crossed-out-eyes'
  | 'sweat-grin'
  | 'star-eyes'
  // Social
  | 'frowning'
  | 'flushed'
  | 'halo'
  | 'smiling-hearts'
  // Stress
  | 'spiral-eyes'
  | 'screaming'
  | 'sunglasses'
  // Legacy aliases (resolved at runtime)
  | 'angry';

/** Legacy aliases — old names that map to new registry ids */
const LEGACY_ALIASES: Record<string, string> = {
  angry: 'angry-face',
};

type Props = {
  name: EmojiName | string;
  size?: number;
  style?: ViewStyle;
};

export function EmojiAsset({ name, size = 52, style }: Props) {
  const resolvedName = LEGACY_ALIASES[name] ?? name;
  const SvgComponent = SVG_EMOJI_MAP[resolvedName];

  if (!SvgComponent) {
    if (__DEV__) console.warn(`EmojiAsset: unknown emoji "${name}"`);
    return <View style={[{ width: size, height: size }, style]} />;
  }

  return (
    <View style={style}>
      <SvgComponent width={size} height={size} />
    </View>
  );
}
