import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useMood, MoodProvider } from '@/constants/MoodContext';
import { computePositivity } from '@/constants/mood-engine';
import { themeColors, typography, expandedCard } from '@/constants/tokens';
import { AvatarRing } from '@/components/AvatarRing';
import { MoodBadge } from '@/components/MoodBadge';
import { IconAsset } from '@/components/IconAsset';
import { MoodTrendGraph } from '@/components/MoodTrendGraph';
import { EmojiAsset, type EmojiName } from '@/components/EmojiAsset';
import { MoodPill } from '@/components/MoodPill';
import { CheckInMeta } from '@/components/CheckInMeta';
import { SelfieStrip } from '@/components/SelfieStrip';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import LogoSvg from '@/assets/logo.svg';
import { PendingInviteCard } from '@/components/PendingInviteCard';
import InviteSvg from '@/assets/icons/invite.svg';

/* ── Notification icon ── */

function NotificationIcon() {
  return (
    <View style={{ width: 27, height: 27 }}>
      <IconAsset name="notification" size={27} color="#000000" />
      <View style={tabStyles.notifDot} />
    </View>
  );
}

/* ── Contact data (shared shape with home) ── */

type MoodPillData = {
  emojiName: EmojiName;
  label: string;
  highlighted?: boolean;
};

type TrendPoint = { label: string; value: number };

type ContactData = {
  name: string;
  contact: string;
  avatarUri: string;
  moodPills: MoodPillData[];
  checkinDate?: string;
  checkinTime?: string;
  checkinLocation?: string;
  selfieUri?: string;
  trend: TrendPoint[];
};

function highlightedPill(pills: MoodPillData[]): MoodPillData | undefined {
  return pills.find((p) => p.highlighted) ?? pills[0];
}

function contactPositivity(pills: MoodPillData[]): number {
  const pill = highlightedPill(pills);
  if (pill) return computePositivity([{ emojiId: pill.emojiName }]);
  return 0;
}

/** Derive an emotionally-aware insight from trend data */
function trendVerdict(trend: TrendPoint[]): { label: string; tone: 'positive' | 'concern' | 'neutral' } {
  if (trend.length < 2) return { label: 'No check-ins yet', tone: 'neutral' };
  const first = trend.slice(0, 3).reduce((s, t) => s + t.value, 0) / 3;
  const last = trend.slice(-3).reduce((s, t) => s + t.value, 0) / 3;
  const avg = trend.reduce((s, t) => s + t.value, 0) / trend.length;
  const diff = last - first;

  // Improving
  if (diff > 0.3 && avg >= 2.0) return { label: 'Doing really well', tone: 'positive' };
  if (diff > 0.3) return { label: 'Getting better', tone: 'positive' };

  // Declining
  if (diff < -0.3 && avg < 1.0) return { label: 'Could use a check-in', tone: 'concern' };
  if (diff < -0.3) return { label: 'Having a rough patch', tone: 'concern' };

  // Stable
  if (avg >= 2.2) return { label: 'In a good place', tone: 'positive' };
  if (avg < 1.0) return { label: 'Been struggling', tone: 'concern' };
  return { label: 'Hanging in there', tone: 'neutral' };
}

const CONTACTS: ContactData[] = [
  {
    name: 'Blakely',
    contact: 'hwerst@gmail...',
    avatarUri: 'https://images.unsplash.com/photo-1678053191873-7f6755146300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    checkinDate: 'Today',
    checkinTime: '2:34 PM',
    checkinLocation: 'Central Park',
    selfieUri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    moodPills: [
      { emojiName: 'smile', label: 'Fine' },
      { emojiName: 'care', label: 'Perfect', highlighted: true },
      { emojiName: 'yawning', label: 'Tiring' },
    ],
    trend: [
      { label: 'Mon', value: 2.1 },
      { label: 'Tue', value: 1.8 },
      { label: 'Wed', value: 2.4 },
      { label: 'Thu', value: 2.6 },
      { label: 'Fri', value: 2.2 },
      { label: 'Sat', value: 2.8 },
      { label: 'Sun', value: 2.5 },
    ],
  },
  {
    name: 'Maria',
    contact: 'matter@scbglob...',
    avatarUri: 'https://images.unsplash.com/photo-1704467391317-87e4182f3435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    checkinDate: 'Feb 27',
    checkinTime: 'Yesterday',
    checkinLocation: 'Home',
    moodPills: [
      { emojiName: 'angry', label: 'Angry', highlighted: true },
      { emojiName: 'expressionless', label: 'Fine' },
      { emojiName: 'care', label: 'Great' },
    ],
    trend: [
      { label: 'Mon', value: 1.2 },
      { label: 'Tue', value: 0.8 },
      { label: 'Wed', value: 0.6 },
      { label: 'Thu', value: 0.9 },
      { label: 'Fri', value: 0.5 },
      { label: 'Sat', value: 0.7 },
      { label: 'Sun', value: 0.4 },
    ],
  },
  {
    name: 'Finn',
    contact: 'finn@outlook.com',
    avatarUri: 'https://images.unsplash.com/photo-1720166067122-b5036f549ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    checkinDate: 'Today',
    checkinTime: '11:20 AM',
    checkinLocation: 'Coffee Shop',
    selfieUri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    moodPills: [
      { emojiName: 'smile', label: 'Good' },
      { emojiName: 'grinning', label: 'Great', highlighted: true },
      { emojiName: 'care', label: 'Perfect' },
    ],
    trend: [
      { label: 'Mon', value: 2.5 },
      { label: 'Tue', value: 2.7 },
      { label: 'Wed', value: 2.9 },
      { label: 'Thu', value: 2.6 },
      { label: 'Fri', value: 2.8 },
      { label: 'Sat', value: 3.0 },
      { label: 'Sun', value: 2.9 },
    ],
  },
  {
    name: 'Jade',
    contact: 'jade.w@proton.me',
    avatarUri: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    checkinDate: 'Today',
    checkinTime: '9:15 AM',
    checkinLocation: 'Gym',
    selfieUri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    moodPills: [
      { emojiName: 'grinning', label: 'Amazing', highlighted: true },
      { emojiName: 'smile', label: 'Good' },
      { emojiName: 'care', label: 'Loved' },
    ],
    trend: [
      { label: 'Mon', value: 2.8 },
      { label: 'Tue', value: 2.9 },
      { label: 'Wed', value: 2.7 },
      { label: 'Thu', value: 3.0 },
      { label: 'Fri', value: 2.9 },
      { label: 'Sat', value: 2.8 },
      { label: 'Sun', value: 3.0 },
    ],
  },
  {
    name: 'Marcus',
    contact: 'marc@company.io',
    avatarUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    checkinDate: 'Today',
    checkinTime: '4:50 PM',
    checkinLocation: 'Office',
    moodPills: [
      { emojiName: 'expressionless', label: 'Flat', highlighted: true },
      { emojiName: 'yawning', label: 'Tired' },
      { emojiName: 'smile', label: 'OK' },
    ],
    trend: [
      { label: 'Mon', value: 1.5 },
      { label: 'Tue', value: 1.3 },
      { label: 'Wed', value: 1.1 },
      { label: 'Thu', value: 1.4 },
      { label: 'Fri', value: 1.2 },
      { label: 'Sat', value: 1.6 },
      { label: 'Sun', value: 1.3 },
    ],
  },
  {
    name: 'Luca',
    contact: 'luca.r@outlook.com',
    avatarUri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    checkinDate: 'Feb 26',
    checkinTime: '6:30 PM',
    checkinLocation: 'Studio',
    moodPills: [
      { emojiName: 'angry', label: 'Upset' },
      { emojiName: 'woozy', label: 'Drained', highlighted: true },
      { emojiName: 'expressionless', label: 'Numb' },
    ],
    trend: [
      { label: 'Mon', value: 0.9 },
      { label: 'Tue', value: 0.7 },
      { label: 'Wed', value: 0.5 },
      { label: 'Thu', value: 0.8 },
      { label: 'Fri', value: 0.6 },
      { label: 'Sat', value: 0.4 },
      { label: 'Sun', value: 0.3 },
    ],
  },
];

const CARD_SPACING = 175;
const CONTACTS_EXPAND_DELTA = 520;
const BASE_TOPS = CONTACTS.map((_, i) => i * CARD_SPACING);
const BASE_TILTS = CONTACTS.map((_, i) =>
  (-2 * (CONTACTS.length - 1 - i)) / (CONTACTS.length - 1)
);
const LAST_CARD_TOP = BASE_TOPS[BASE_TOPS.length - 1];
const BASE_CONTENT_HEIGHT = LAST_CARD_TOP + expandedCard.collapsedHeight + 40;

const SPRING_CONFIG = { tension: 50, friction: 12, useNativeDriver: false };

/* ── Trend Contact Card ── */

function TrendContactCard({
  c,
  expandAnim,
  tiltAnim,
  onPress,
}: {
  c: ContactData;
  expandAnim: Animated.Value;
  tiltAnim: Animated.Value;
  onPress: () => void;
}) {
  const { themed, positivity } = useMood();
  const gradientStart = themed(themeColors.moodCardStart);
  const gradientEnd = themed(themeColors.moodCardEnd);
  const shadowColor = themed(themeColors.moodShadow);
  const meshColor = themed(themeColors.moodMeshAnchor);
  const nameColor = themed(themeColors.moodTextPrimary);
  const contactColor = themed(themeColors.moodTextSecondary);
  const accentColor = themed(themeColors.accent);

  const pill = highlightedPill(c.moodPills);
  const verdict = trendVerdict(c.trend);

  const animatedMaxHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [expandedCard.collapsedHeight, 999],
  });

  const contentOpacity = expandAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 0, 1],
  });
  const contentTranslateY = expandAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [10, 10, 0],
  });

  const animatedRotateX = tiltAnim.interpolate({
    inputRange: [-2, 0],
    outputRange: ['-2deg', '0deg'],
  });
  const animatedShadowRadius = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 80],
  });
  const animatedShadowOffsetY = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, -20],
  });
  const animatedShadowOpacity = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.85],
  });
  const animatedElevation = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 24],
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.cardOuter,
          { maxHeight: animatedMaxHeight, overflow: 'hidden' as const },
          {
            shadowColor: meshColor,
            shadowOffset: { width: 0, height: animatedShadowOffsetY },
            shadowOpacity: animatedShadowOpacity,
            shadowRadius: animatedShadowRadius,
            elevation: animatedElevation,
            transform: [{ perspective: 800 }, { rotateX: animatedRotateX }],
          },
        ]}
      >
        <LinearGradient
          colors={[gradientStart, gradientEnd]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[styles.card, { shadowColor }]}
        >
          <View style={styles.topRow}>
            <AvatarRing uri={c.avatarUri} size={60} />
            {pill && (
              <View style={styles.badge}>
                <Text style={[styles.moodLabel, { color: accentColor }]}>
                  {pill.label}
                </Text>
                <EmojiAsset name={pill.emojiName} size={24} />
              </View>
            )}
          </View>

          <View style={styles.userInfo}>
            <Text style={[styles.name, { color: nameColor }]}>{c.name}</Text>
            <Text style={[styles.contact, { color: contactColor }]}>
              {c.contact}
            </Text>
          </View>

          {/* Expanded content */}
          <Animated.View
            style={[
              styles.expandedContent,
              {
                opacity: contentOpacity,
                transform: [{ translateY: contentTranslateY }],
              },
            ]}
          >
            {/* Mood pills */}
            <View style={styles.pillsRow}>
              {c.moodPills.map((p) => (
                <MoodPill
                  key={p.emojiName}
                  emojiName={p.emojiName}
                  label={p.label}
                  highlighted={p.highlighted}
                />
              ))}
            </View>

            {/* Check-in meta */}
            {(c.checkinDate || c.checkinTime || c.checkinLocation) && (
              <CheckInMeta
                date={c.checkinDate}
                time={c.checkinTime}
                location={c.checkinLocation}
              />
            )}

            {/* Selfie row */}
            <SelfieStrip
              uri={c.selfieUri}
              name={c.name}
              onRequestSelfie={() => console.log(`Nudge ${c.name}`)}
            />

            {/* Trend graph + verdict */}
            <View style={styles.trendSection}>
              <View style={styles.trendHeader}>
                <Text style={[styles.trendTitle, { color: nameColor }]}>
                  This week
                </Text>
                <Text style={[
                  styles.verdictText,
                  { color: verdict.tone === 'concern' ? '#C43E55' : verdict.tone === 'positive' ? '#2E8B57' : contactColor },
                ]}>
                  {verdict.label}
                </Text>
              </View>
              <View style={styles.graphWrap}>
                <MoodTrendGraph data={c.trend} width={300} height={120} />
              </View>
            </View>

            {/* Checkup button — only for struggling contacts */}
            {positivity < 0.6 && (
              <ButtonPrimary
                label="Checkup"
                onPress={() => console.log(`Checkup ${c.name}`)}
                style={styles.checkupButton}
              />
            )}
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

/* ── Contacts Screen ── */

export default function ContactsScreen() {
  const { themed } = useMood();
  const gradStart = themed(themeColors.surfacePrimary);
  const gradEnd = themed(themeColors.surfaceSecondary);
  const primaryText = themed(themeColors.moodTextPrimary);
  const router = useRouter();

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const cardTopAnims = useRef(
    BASE_TOPS.map((t) => new Animated.Value(t))
  ).current;
  const cardExpandAnims = useRef(
    CONTACTS.map(() => new Animated.Value(0))
  ).current;
  const cardTiltAnims = useRef(
    BASE_TILTS.map((t) => new Animated.Value(t))
  ).current;

  const contentHeight = useMemo(
    () =>
      expandedIndex !== null
        ? BASE_CONTENT_HEIGHT + CONTACTS_EXPAND_DELTA
        : BASE_CONTENT_HEIGHT,
    [expandedIndex]
  );

  const animateTops = useCallback(
    (activeIndex: number | null) => {
      const anims = CONTACTS.map((_, j) => {
        const target =
          activeIndex !== null && j > activeIndex
            ? BASE_TOPS[j] + CONTACTS_EXPAND_DELTA
            : BASE_TOPS[j];
        return Animated.spring(cardTopAnims[j], {
          toValue: target,
          ...SPRING_CONFIG,
        });
      });
      Animated.parallel(anims).start();
    },
    [cardTopAnims]
  );

  const handleCardPress = useCallback(
    (index: number) => {
      if (expandedIndex === null) {
        setExpandedIndex(index);
        Animated.parallel([
          Animated.spring(cardExpandAnims[index], { toValue: 1, ...SPRING_CONFIG }),
          Animated.spring(cardTiltAnims[index], { toValue: 0, ...SPRING_CONFIG }),
        ]).start();
        animateTops(index);
      } else if (expandedIndex === index) {
        setExpandedIndex(null);
        Animated.timing(cardExpandAnims[index], {
          toValue: 0.6, duration: 150, useNativeDriver: false,
        }).start(() => {
          Animated.parallel([
            Animated.spring(cardExpandAnims[index], { toValue: 0, ...SPRING_CONFIG }),
            Animated.spring(cardTiltAnims[index], { toValue: BASE_TILTS[index], ...SPRING_CONFIG }),
          ]).start();
          animateTops(null);
        });
      } else {
        const old = expandedIndex;
        setExpandedIndex(index);
        Animated.timing(cardExpandAnims[old], {
          toValue: 0.6, duration: 150, useNativeDriver: false,
        }).start(() => {
          Animated.parallel([
            Animated.spring(cardExpandAnims[old], { toValue: 0, ...SPRING_CONFIG }),
            Animated.spring(cardTiltAnims[old], { toValue: BASE_TILTS[old], ...SPRING_CONFIG }),
            Animated.spring(cardExpandAnims[index], { toValue: 1, ...SPRING_CONFIG }),
            Animated.spring(cardTiltAnims[index], { toValue: 0, ...SPRING_CONFIG }),
          ]).start();
          animateTops(index);
        });
      }
    },
    [expandedIndex, cardExpandAnims, cardTiltAnims, animateTops]
  );

  return (
    <LinearGradient
      colors={[gradStart, gradEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.screen}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <View style={styles.logoFrame}>
          <LogoSvg width={103} height={43} />
        </View>

        {/* Header: title + invite CTA */}
        <View style={styles.headerRow}>
          <Text style={[styles.pageTitle, { color: primaryText }]}>Contacts</Text>
          <Pressable
            onPress={() => console.log('Invite flow')}
            style={styles.inviteBtn}
          >
            <Text style={styles.inviteBtnText}>Invite</Text>
            <InviteSvg width={24} height={24} />
          </Pressable>
        </View>

        {/* ─── Pending invites ─── */}
        <View style={styles.pendingSection}>
          <Text style={[styles.sectionLabel, { color: primaryText }]}>
            Pending
          </Text>
          <View style={styles.pendingList}>
            <PendingInviteCard
              name="Alex M."
              initials="AM"
              sentAgo="2d ago"
              onResend={() => console.log('Resend Alex')}
            />
            <PendingInviteCard
              name="Sarah K."
              initials="SK"
              sentAgo="5d ago"
              onResend={() => console.log('Resend Sarah')}
            />
          </View>
        </View>

        {/* ─── Contact cards ─── */}
        <View style={[styles.contactList, { height: contentHeight }]}>
          {CONTACTS.map((c, i) => (
            <MoodProvider key={c.name} initialPositivity={contactPositivity(c.moodPills)}>
              <Animated.View
                style={[
                  styles.contactCardWrap,
                  {
                    top: cardTopAnims[i],
                    zIndex: expandedIndex === i ? 10 : i,
                  },
                ]}
              >
                <TrendContactCard
                  c={c}
                  expandAnim={cardExpandAnims[i]}
                  tiltAnim={cardTiltAnims[i]}
                  onPress={() => handleCardPress(i)}
                />
              </Animated.View>
            </MoodProvider>
          ))}
        </View>
      </ScrollView>

      {/* ─── Tab bar ─── */}
      <View style={tabStyles.bar}>
        <Pressable onPress={() => router.push('/home')}>
          <IconAsset name="home" size={32} color="#00000040" />
        </Pressable>
        <NotificationIcon />
        <IconAsset name="plus" size={40} color="#220601" />
        <IconAsset name="user" size={32} color="#000000" />
        <IconAsset name="receipt" size={32} color="#00000040" />
      </View>
    </LinearGradient>
  );
}

/* ── Styles ── */

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollView: { flex: 1 },
  logoFrame: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scrollContent: {
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 90,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pageTitle: {
    fontFamily: typography.fontFamily,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 100,
    backgroundColor: '#3D2117',
    shadowColor: '#3D211730',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 1,
    elevation: 4,
  },
  inviteBtnText: {
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactList: {},
  contactCardWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  pendingSection: {
    gap: 12,
    marginTop: 8,
  },
  sectionLabel: {
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
    opacity: 0.6,
  },
  pendingList: {
    gap: 12,
  },
  cardOuter: { borderRadius: 32 },
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
  userInfo: { gap: 2 },
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
  trendSection: {
    gap: 8,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trendTitle: {
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.5,
  },
  verdictText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
  },
  graphWrap: {
    alignItems: 'center',
  },
  checkupButton: {
    alignSelf: 'stretch',
  },
});

const tabStyles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 69,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 51,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  notifDot: {
    position: 'absolute',
    top: -1,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e73d3d',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
