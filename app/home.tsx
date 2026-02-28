import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useMood, MoodProvider } from '@/constants/MoodContext';
import {
  computePositivity,
  computeCheckinScore,
  checkinScoreToPositivity,
} from '@/constants/mood-engine';
import {
  themeColors,
  typography,
  expandedCard,
} from '@/constants/tokens';
import LogoSvg from '@/assets/logo.svg';
import { AvatarRing } from '@/components/AvatarRing';
import { MoodBadge } from '@/components/MoodBadge';
import { ContactCard } from '@/components/ContactCard';
import { IconAsset } from '@/components/IconAsset';
import { MoodDial, FingerprintIcon } from '@/components/MoodDial';
import { NeuToggle } from '@/components/NeuToggle';
import { IconAsset as Icon } from '@/components/IconAsset';
import { PendingInviteCard } from '@/components/PendingInviteCard';
import { InviteStickerCard } from '@/components/InviteStickerCard';
import type { EmojiName } from '@/components/EmojiAsset';
import { useCountdown } from '@/hooks/useCountdown';

/* ── Success checkmark icon ── */

function SuccessIcon({ size = 35 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 35 35">
      <SvgCircle cx={17.5} cy={17.5} r={17.5} fill="#fdc66b" />
      <Path
        d="M11 17.5L15.5 22L24 13"
        stroke="#5a2a13"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/* ── Notification icon with red dot ── */

function NotificationIcon() {
  return (
    <View style={{ width: 27, height: 27 }}>
      <IconAsset name="notification" size={27} color="#000000" />
      <View style={tabStyles.notifDot} />
    </View>
  );
}

/* ── Contact card data ── */

type MoodPillData = {
  emojiName: EmojiName;
  label: string;
  highlighted?: boolean;
};

type ContactData = {
  name: string;
  contact: string;
  avatarUri: string;
  timerSeconds?: number;
  moodPills: MoodPillData[];
  checkinDate?: string;
  checkinTime?: string;
  checkinLocation?: string;
  selfieUri?: string;
};

const CARD_SPACING = 175;

/** Get the highlighted pill, or first pill as fallback. */
function highlightedPill(pills: MoodPillData[]): MoodPillData | undefined {
  return pills.find(p => p.highlighted) ?? pills[0];
}

/** Derive positivity from a contact's highlighted mood pill. */
function contactPositivity(pills: MoodPillData[]): number {
  const pill = highlightedPill(pills);
  if (pill) {
    return computePositivity([{ emojiId: pill.emojiName }]);
  }
  return 0;
}

const CONTACTS: ContactData[] = [
  {
    name: 'Blakely',
    contact: 'hwerst@gmail...',
    avatarUri:
      'https://images.unsplash.com/photo-1678053191873-7f6755146300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    checkinDate: 'Today',
    checkinTime: '2:34 PM',
    checkinLocation: 'Central Park',
    selfieUri:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    moodPills: [
      { emojiName: 'smile', label: 'Fine' },
      { emojiName: 'care', label: 'Perfect', highlighted: true },
      { emojiName: 'yawning', label: 'Tiring' },
    ],
  },
  {
    name: 'Cynthia',
    contact: 'cytnne@scbglobal.com',
    avatarUri:
      'https://images.unsplash.com/photo-1614127710105-e327c0046b5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    timerSeconds: 24 * 60 + 38,
    moodPills: [
      { emojiName: 'expressionless', label: 'Meh' },
      { emojiName: 'smile', label: 'Good', highlighted: true },
      { emojiName: 'angry', label: 'Bad' },
    ],
  },
  {
    name: 'Maria',
    contact: 'matter@scbglob...',
    avatarUri:
      'https://images.unsplash.com/photo-1704467391317-87e4182f3435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    checkinDate: 'Feb 27',
    checkinTime: 'Yesterday',
    checkinLocation: 'Home',
    moodPills: [
      { emojiName: 'angry', label: 'Angry', highlighted: true },
      { emojiName: 'expressionless', label: 'Fine' },
      { emojiName: 'care', label: 'Great' },
    ],
  },
  {
    name: 'Finn',
    contact: 'finn@outlook.com',
    avatarUri:
      'https://images.unsplash.com/photo-1720166067122-b5036f549ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    checkinDate: 'Today',
    checkinTime: '11:20 AM',
    checkinLocation: 'Coffee Shop',
    selfieUri:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    moodPills: [
      { emojiName: 'smile', label: 'Good' },
      { emojiName: 'grinning', label: 'Great', highlighted: true },
      { emojiName: 'care', label: 'Perfect' },
    ],
  },
  {
    name: 'Jade',
    contact: 'jade.w@proton.me',
    avatarUri:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    checkinDate: 'Today',
    checkinTime: '9:15 AM',
    checkinLocation: 'Gym',
    selfieUri:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    moodPills: [
      { emojiName: 'grinning', label: 'Amazing', highlighted: true },
      { emojiName: 'smile', label: 'Good' },
      { emojiName: 'care', label: 'Loved' },
    ],
  },
  {
    name: 'Marcus',
    contact: 'marc@company.io',
    avatarUri:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    checkinDate: 'Today',
    checkinTime: '4:50 PM',
    checkinLocation: 'Office',
    moodPills: [
      { emojiName: 'expressionless', label: 'Flat', highlighted: true },
      { emojiName: 'yawning', label: 'Tired' },
      { emojiName: 'smile', label: 'OK' },
    ],
  },
  {
    name: 'Priya',
    contact: 'priya@gmail.com',
    avatarUri:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    checkinDate: 'Today',
    checkinTime: '1:00 PM',
    checkinLocation: 'Beach',
    selfieUri:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    moodPills: [
      { emojiName: 'care', label: 'Loved', highlighted: true },
      { emojiName: 'grinning', label: 'Joyful' },
      { emojiName: 'smile', label: 'Content' },
    ],
  },
  {
    name: 'Luca',
    contact: 'luca.r@outlook.com',
    avatarUri:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    checkinDate: 'Feb 26',
    checkinTime: '6:30 PM',
    checkinLocation: 'Studio',
    moodPills: [
      { emojiName: 'angry', label: 'Upset' },
      { emojiName: 'woozy', label: 'Drained', highlighted: true },
      { emojiName: 'expressionless', label: 'Numb' },
    ],
  },
];

const BASE_TOPS = CONTACTS.map((_, i) => i * CARD_SPACING);
const BASE_TILTS = CONTACTS.map((_, i) =>
  (-2 * (CONTACTS.length - 1 - i)) / (CONTACTS.length - 1)
);
const LAST_CARD_TOP = BASE_TOPS[BASE_TOPS.length - 1];
const BASE_CONTENT_HEIGHT =
  LAST_CARD_TOP + expandedCard.collapsedHeight + 40;

const PROFILE_AVATAR =
  'https://images.unsplash.com/photo-1704467391317-87e4182f3435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200';

const SPRING_CONFIG = { tension: 50, friction: 12, useNativeDriver: false };

/* ── Countdown badge (calls hook, renders MoodBadge) ── */

function CountdownBadge({ initialSeconds }: { initialSeconds: number }) {
  const { seconds, urgent } = useCountdown({
    initialSeconds,
    onComplete: () => console.log('Timer complete!'),
  });
  return (
    <MoodBadge variant="timer" timerSeconds={seconds} urgent={urgent} />
  );
}

/* ── Home screen ── */

const USER_MOOD_BADGE: Record<string, { label: string; emoji: EmojiName }> = {
  bad: { label: 'Rough', emoji: 'angry' },
  neutral: { label: 'Check in', emoji: 'expressionless' },
  moody: { label: 'Okay', emoji: 'smile' },
  great: { label: 'Great', emoji: 'grinning' },
};

export default function HomeScreen() {
  const router = useRouter();
  const { themed, mood, setPositivity } = useMood();
  const gradStart = themed(themeColors.surfacePrimary);
  const gradEnd = themed(themeColors.surfaceSecondary);
  const primaryText = themed(themeColors.moodTextPrimary);
  const secondaryText = themed(themeColors.moodTextSecondary);
  const accentColor = themed(themeColors.accent);
  const userBadge = USER_MOOD_BADGE[mood] ?? USER_MOOD_BADGE.neutral;

  const [checkedIn, setCheckedIn] = useState(false);
  const [dialOpen, setDialOpen] = useState(false);
  const [dialTitle, setDialTitle] = useState('Send your peace of mind');
  const [dialPhase, setDialPhase] = useState(-1);
  const [dialMode, setDialMode] = useState<'button' | 'dial' | 'summary'>('button');
  const [selfieToggle, setSelfieToggle] = useState(false);
  const titleFade = useRef(new Animated.Value(1)).current;
  const selfieCardFade = useRef(new Animated.Value(0)).current;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const cardListY = useRef(0);
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
        ? BASE_CONTENT_HEIGHT + expandedCard.expandDelta
        : BASE_CONTENT_HEIGHT,
    [expandedIndex]
  );

  const scrollY = useRef(0);
  const viewportH = useRef(0);

  const scrollCardIntoView = useCallback((index: number) => {
    const cardY = cardListY.current + BASE_TOPS[index];
    const cardBottom = cardY + expandedCard.expandedHeight;
    const visibleBottom = scrollY.current + viewportH.current;

    // Only scroll if the expanded card's bottom would be clipped
    if (cardBottom > visibleBottom - 40) {
      const target = cardBottom - viewportH.current + 120;
      scrollRef.current?.scrollTo({ y: Math.max(0, target), animated: true });
    }
  }, []);

  const animateTops = useCallback(
    (activeIndex: number | null) => {
      const anims = CONTACTS.map((_, j) => {
        const target =
          activeIndex !== null && j > activeIndex
            ? BASE_TOPS[j] + expandedCard.expandDelta
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
          Animated.spring(cardExpandAnims[index], {
            toValue: 1,
            ...SPRING_CONFIG,
          }),
          Animated.spring(cardTiltAnims[index], {
            toValue: 0,
            ...SPRING_CONFIG,
          }),
        ]).start();
        animateTops(index);
        scrollCardIntoView(index);
      } else if (expandedIndex === index) {
        setExpandedIndex(null);
        Animated.timing(cardExpandAnims[index], {
          toValue: 0.6,
          duration: 150,
          useNativeDriver: false,
        }).start(() => {
          Animated.parallel([
            Animated.spring(cardExpandAnims[index], {
              toValue: 0,
              ...SPRING_CONFIG,
            }),
            Animated.spring(cardTiltAnims[index], {
              toValue: BASE_TILTS[index],
              ...SPRING_CONFIG,
            }),
          ]).start();
          animateTops(null);
        });
      } else {
        const oldIndex = expandedIndex;
        setExpandedIndex(index);
        Animated.timing(cardExpandAnims[oldIndex], {
          toValue: 0.6,
          duration: 150,
          useNativeDriver: false,
        }).start(() => {
          Animated.parallel([
            Animated.spring(cardExpandAnims[oldIndex], {
              toValue: 0,
              ...SPRING_CONFIG,
            }),
            Animated.spring(cardTiltAnims[oldIndex], {
              toValue: BASE_TILTS[oldIndex],
              ...SPRING_CONFIG,
            }),
            Animated.spring(cardExpandAnims[index], {
              toValue: 1,
              ...SPRING_CONFIG,
            }),
            Animated.spring(cardTiltAnims[index], {
              toValue: 0,
              ...SPRING_CONFIG,
            }),
          ]).start();
          animateTops(index);
          scrollCardIntoView(index);
        });
      }
    },
    [expandedIndex, cardExpandAnims, cardTiltAnims, animateTops, scrollCardIntoView]
  );

  return (
    <LinearGradient
      colors={[gradStart, gradEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.screen}
    >
      {/* ─── Scrollable content ─── */}
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces
        decelerationRate={0.992}
        scrollEventThrottle={16}
        onLayout={(e) => { viewportH.current = e.nativeEvent.layout.height; }}
        onScroll={(e) => { scrollY.current = e.nativeEvent.contentOffset.y; }}
      >
        {/* Logo */}
        <View style={styles.logoFrame}>
          <LogoSvg width={103} height={43} />
        </View>

        {/* Profile + Badge row */}
        <View style={styles.topSection}>
          <View style={styles.profile}>
            <AvatarRing uri={PROFILE_AVATAR} size={60} />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: primaryText }]}>
                Olivia
              </Text>
              <Text style={[styles.profileContact, { color: secondaryText }]}>
                matter@scbglob...
              </Text>
            </View>
          </View>
          {checkedIn ? (
            <MoodBadge
              label={userBadge.label}
              emojiName={userBadge.emoji}
              style={styles.profileBadge}
            />
          ) : (
            <MoodBadge
              label="Check in"
              style={styles.profileBadge}
            />
          )}
        </View>

        {/* Status row — tappable, opens mood dial */}
        <Pressable onPress={() => setDialOpen(true)}>
          <View style={styles.statusRow}>
            {checkedIn ? (
              <>
                <View style={styles.statusLeft}>
                  <SuccessIcon size={35} />
                  <Text style={[styles.statusText, { color: primaryText }]}>
                    Complete
                  </Text>
                </View>
                <CountdownBadge initialSeconds={12 * 60 + 38} />
              </>
            ) : (
              <>
                <View style={styles.statusLeft}>
                  <FingerprintIcon size={28} color={accentColor} />
                  <Text style={[styles.statusText, { color: primaryText }]}>
                    Check in
                  </Text>
                </View>
                <CountdownBadge initialSeconds={12 * 60 + 38} />
              </>
            )}
          </View>
        </Pressable>

        {/* Contact cards */}
        <View
          style={[styles.contactList, { height: contentHeight }]}
          onLayout={(e) => { cardListY.current = e.nativeEvent.layout.y; }}
        >
          {CONTACTS.map((c, i) => {
            const checkedIn = !c.timerSeconds;
            const pill = checkedIn ? highlightedPill(c.moodPills) : undefined;
            return (
            <MoodProvider key={c.name} initialPositivity={checkedIn ? contactPositivity(c.moodPills) : 0}>
              <Animated.View
                style={[
                  styles.contactCard,
                  {
                    top: cardTopAnims[i],
                    zIndex: expandedIndex === i ? 10 : i,
                  },
                ]}
              >
                <ContactCard
                  avatarUri={c.avatarUri}
                  name={c.name}
                  contact={c.contact}
                  moodLabel={pill?.label}
                  moodEmojiName={pill?.emojiName}
                  badge={
                    c.timerSeconds ? (
                      <CountdownBadge initialSeconds={c.timerSeconds} />
                    ) : undefined
                  }
                  expanded={expandedIndex === i}
                  onPress={() => handleCardPress(i)}
                  moodPills={c.moodPills}
                  onCheckup={() =>
                    console.log(`Checkup pressed for ${c.name}`)
                  }
                  expandAnim={cardExpandAnims[i]}
                  tiltAnim={cardTiltAnims[i]}
                  checkinDate={checkedIn ? c.checkinDate : undefined}
                  checkinTime={checkedIn ? c.checkinTime : undefined}
                  checkinLocation={checkedIn ? c.checkinLocation : undefined}
                  selfieUri={checkedIn ? c.selfieUri : undefined}
                />
              </Animated.View>
            </MoodProvider>
            );
          })}
        </View>

        {/* ─── Pending invites ─── */}
        <View style={styles.pendingSection}>
          <Text style={[styles.sectionLabel, { color: secondaryText }]}>
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

        {/* ─── Invite sticker ─── */}
        <View style={styles.stickerWrap}>
          <InviteStickerCard
            onPress={() => console.log('Invite flow')}
          />
        </View>
      </ScrollView>

      {/* ─── Tab bar ─── */}
      <View style={tabStyles.bar}>
        <IconAsset name="home" size={32} color="#000000" />
        <NotificationIcon />
        <IconAsset name="plus" size={40} color="#220601" />
        <Pressable onPress={() => router.push('/contacts')}>
          <IconAsset name="user" size={32} color="#00000040" />
        </Pressable>
        <IconAsset name="receipt" size={32} color="#00000040" />
      </View>

      {/* ─── Mood dial bottom sheet ─── */}
      <Modal
        visible={dialOpen}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setDialOpen(false)}
      >
        <Pressable style={sheetStyles.backdrop} onPress={() => setDialOpen(false)} />
        <View style={sheetStyles.sheet}>
          <View style={sheetStyles.handle} />
          <Animated.Text style={[sheetStyles.title, { opacity: titleFade }]}>
            {dialTitle}
          </Animated.Text>
          <View style={sheetStyles.dialWrap}>
            <MoodDial
              onPhaseChange={(idx, phaseTitle) => {
                setDialPhase(idx);
                Animated.timing(titleFade, {
                  toValue: 0,
                  duration: 150,
                  useNativeDriver: true,
                }).start(() => {
                  const titles: Record<string, string> = {
                    Feeling: 'How are you feeling?',
                    Health: "How's your health?",
                    Energy: "What's your energy like?",
                    Social: "How's your social life?",
                  };
                  setDialTitle(titles[phaseTitle] ?? `Your ${phaseTitle.toLowerCase()}?`);
                  Animated.timing(titleFade, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                  }).start();
                });
              }}
              onModeChange={(mode) => {
                setDialMode(mode);
                Animated.timing(selfieCardFade, {
                  toValue: mode === 'summary' ? 1 : 0,
                  duration: 250,
                  useNativeDriver: true,
                }).start();
              }}
              onComplete={(selections) => {
                // Convert selections to phase scores and compute weighted result
                const phaseSelections = Object.values(selections).map((s) => ({
                  emojiIndex: s.emojiIndex,
                }));
                const { score } = computeCheckinScore(phaseSelections);
                const positivity = checkinScoreToPositivity(score);
                setPositivity(positivity);
                setCheckedIn(true);
                setDialOpen(false);
                setDialTitle('Send your peace of mind');
                setDialPhase(-1);
                setDialMode('button');
                setSelfieToggle(false);
                titleFade.setValue(1);
                selfieCardFade.setValue(0);
              }}
            />
          </View>

          {/* Hint — below dial, dynamic based on mode */}
          <Text style={sheetStyles.hint}>
            {dialMode === 'button'
              ? 'TAP TO CHECK-IN'
              : dialMode === 'dial'
              ? 'HOLD DOWN AND TURN'
              : 'SENDING...'}
          </Text>

          {/* Selfie option — appears on final phase */}
          <Animated.View style={[sheetStyles.selfieCard, { opacity: selfieCardFade }]}>
            <View style={sheetStyles.selfieLeft}>
              <Icon name="camera" size={18} color="#8E8078" />
              <Text style={sheetStyles.selfieText}>Include a selfie</Text>
            </View>
            <NeuToggle value={selfieToggle} onValueChange={setSelfieToggle} />
          </Animated.View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

/* ── Styles ── */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 90,
    gap: 16,
  },
  logoFrame: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 12,
  },
  profile: {
    gap: 20,
  },
  profileInfo: {
    gap: 0,
  },
  profileName: {
    fontFamily: typography.fontFamily,
    fontSize: 33,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  profileContact: {
    fontFamily: typography.fontFamily,
    fontSize: 22,
    fontWeight: '500',
    opacity: 0.45,
  },
  profileBadge: {
    backgroundColor: '#ffffff75',
    gap: 12,
    alignSelf: 'flex-start',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 21,
    backgroundColor: '#ffffff91',
    paddingVertical: 14,
    paddingHorizontal: 23,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  statusText: {
    fontFamily: typography.fontFamily,
    fontSize: 21,
    fontWeight: '600',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  contactList: {
    // height set dynamically
  },
  contactCard: {
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
  stickerWrap: {
    marginTop: 20,
    paddingHorizontal: 8,
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

const sheetStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000030',
  },
  sheet: {
    position: 'absolute',
    bottom: 69,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 14,
    paddingBottom: 36,
    shadowColor: '#00000020',
    shadowOffset: { width: 0, height: -8 },
    shadowRadius: 24,
    elevation: 16,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D8D8D8',
    alignSelf: 'center',
    marginBottom: 28,
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.6,
    lineHeight: 38,
    color: '#320903',
    textAlign: 'left',
    paddingHorizontal: 36,
    marginBottom: 12,
  },
  dialWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 420,
    paddingBottom: 20,
  },
  selfieCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 36,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F7F7F7',
    borderRadius: 20,
  },
  selfieLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selfieText: {
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#5C4A3D',
  },
  hint: {
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 2.5,
    color: '#C0B8B0',
    textAlign: 'center',
    marginTop: 16,
  },
});
