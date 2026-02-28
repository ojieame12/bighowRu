import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMood } from '@/constants/MoodContext';
import { themeColors, expandedCard } from '@/constants/tokens';
import { AvatarRing } from './AvatarRing';
import { EmojiAsset, type EmojiName } from './EmojiAsset';
import { MoodPill } from './MoodPill';
import { ButtonPrimary } from './ButtonPrimary';
import { CheckInMeta } from './CheckInMeta';
import { SelfieStrip } from './SelfieStrip';

type MoodPillData = {
  emojiName: EmojiName;
  label: string;
  highlighted?: boolean;
};

type Props = {
  avatarUri: string;
  name: string;
  contact: string;
  moodLabel?: string;
  moodEmoji?: React.ReactNode;
  moodEmojiName?: EmojiName;
  badge?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  expanded?: boolean;
  onPress?: () => void;
  moodPills?: MoodPillData[];
  onCheckup?: () => void;
  expandAnim?: Animated.Value;
  tiltAnim?: Animated.Value;
  checkinDate?: string;
  checkinTime?: string;
  checkinLocation?: string;
  selfieUri?: string;
};

export function ContactCard({
  avatarUri,
  name,
  contact,
  moodLabel,
  moodEmoji,
  moodEmojiName,
  badge,
  style,
  onPress,
  moodPills,
  onCheckup,
  expandAnim,
  tiltAnim,
  checkinDate,
  checkinTime,
  checkinLocation,
  selfieUri,
}: Props) {
  const { themed, positivity } = useMood();
  const gradientStart = themed(themeColors.moodCardStart);
  const gradientEnd = themed(themeColors.moodCardEnd);
  const shadowColor = themed(themeColors.moodShadow);
  const nameColor = themed(themeColors.moodTextPrimary);
  const contactColor = themed(themeColors.moodTextSecondary);
  const accentColor = themed(themeColors.accent);

  const meshColor = themed(themeColors.moodMeshAnchor);

  // Collapsed: clip to collapsedHeight. Expanded: large maxHeight so content hugs.
  const animatedMaxHeight = expandAnim
    ? expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [expandedCard.collapsedHeight, 999],
      })
    : expandedCard.collapsedHeight;

  const contentOpacity = expandAnim
    ? expandAnim.interpolate({
        inputRange: [0, 0.6, 1],
        outputRange: [0, 0, 1],
      })
    : 0;

  const contentTranslateY = expandAnim
    ? expandAnim.interpolate({
        inputRange: [0, 0.6, 1],
        outputRange: [10, 10, 0],
      })
    : 10;

  const animatedRotateX = tiltAnim
    ? tiltAnim.interpolate({
        inputRange: [-2, 0],
        outputRange: ['-2deg', '0deg'],
      })
    : '0deg';

  // Expanded cards get boosted shadow depth
  const animatedShadowRadius = expandAnim
    ? expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 80],
      })
    : 20;

  const animatedShadowOffsetY = expandAnim
    ? expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-6, -20],
      })
    : -6;

  const animatedShadowOpacity = expandAnim
    ? expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.35, 0.85],
      })
    : 0.35;

  const animatedElevation = expandAnim
    ? expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [6, 24],
      })
    : 6;

  const inner = (
    <Animated.View
      style={[
        styles.cardOuter,
        {
          maxHeight: animatedMaxHeight,
          overflow: 'hidden' as const,
        },
        {
          shadowColor: meshColor,
          shadowOffset: { width: 0, height: animatedShadowOffsetY },
          shadowOpacity: animatedShadowOpacity,
          shadowRadius: animatedShadowRadius,
          elevation: animatedElevation,
          transform: [
            { perspective: 800 },
            { rotateX: animatedRotateX },
          ],
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[gradientStart, gradientEnd]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.card, { shadowColor }]}
      >
        <View style={styles.topRow}>
          <AvatarRing uri={avatarUri} size={60} />
          {badge != null
            ? badge
            : moodLabel != null && (
                <View style={styles.badge}>
                  <Text style={[styles.moodLabel, { color: accentColor }]}>
                    {moodLabel}
                  </Text>
                  {moodEmojiName != null && (
                    <EmojiAsset name={moodEmojiName} size={24} />
                  )}
                  {moodEmoji != null && !moodEmojiName && moodEmoji}
                </View>
              )}
        </View>

        <View style={styles.userInfo}>
          <Text style={[styles.name, { color: nameColor }]}>{name}</Text>
          <Text style={[styles.contact, { color: contactColor }]}>
            {contact}
          </Text>
        </View>

        {moodPills && moodPills.length > 0 && (
          <Animated.View
            style={[
              styles.expandedContent,
              {
                opacity: contentOpacity,
                transform: [{ translateY: contentTranslateY }],
              },
            ]}
          >
            <View style={styles.pillsRow}>
              {moodPills.map((pill) => (
                <MoodPill
                  key={pill.emojiName}
                  emojiName={pill.emojiName}
                  label={pill.label}
                  highlighted={pill.highlighted}
                />
              ))}
            </View>
            {(checkinDate || checkinTime || checkinLocation) && (
              <CheckInMeta date={checkinDate} time={checkinTime} location={checkinLocation} />
            )}
            <SelfieStrip
              uri={selfieUri}
              name={name}
              onRequestSelfie={() =>
                console.log(`Nudge selfie for ${name}`)
              }
            />
            {positivity < 0.6 && (
              <ButtonPrimary
                label="Checkup"
                onPress={onCheckup ?? (() => {})}
                style={styles.checkupButton}
              />
            )}
          </Animated.View>
        )}
      </LinearGradient>
    </Animated.View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{inner}</Pressable>;
  }

  return inner;
}

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: 32,
  },
  card: {
    flex: 1,
    borderRadius: 32,
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    gap: 20,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 193,
    height: 44,
    paddingHorizontal: 14,
  },
  moodLabel: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.24,
  },
  emoji: {
    fontSize: 18,
  },
  userInfo: {
    gap: 2,
  },
  name: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 23,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  contact: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 23,
    fontWeight: '500',
    opacity: 0.6,
  },
  expandedContent: {
    gap: 16,
    paddingTop: 4,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  checkupButton: {
    alignSelf: 'stretch',
  },
});
