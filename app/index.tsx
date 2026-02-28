import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import { useMood } from '@/constants/MoodContext';
import { type Mood, themeColors, colors } from '@/constants/tokens';

// Buttons
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { ButtonSecondary } from '@/components/ButtonSecondary';
import { ButtonGhost } from '@/components/ButtonGhost';
import { ButtonPrimaryIcon } from '@/components/ButtonPrimaryIcon';
import { ButtonSecondaryIcon } from '@/components/ButtonSecondaryIcon';

// Inputs
import { InputField } from '@/components/InputField';
import { InputLabel } from '@/components/InputLabel';
import { InputHint } from '@/components/InputHint';
import { LabeledInput } from '@/components/LabeledInput';

// Cards & Profiles
import { CardSurface } from '@/components/CardSurface';
import { MoodCard } from '@/components/MoodCard';
import { ContactCard } from '@/components/ContactCard';
import { UserProfile } from '@/components/UserProfile';
import { UserProfileCard } from '@/components/UserProfileCard';
import { AvatarRing } from '@/components/AvatarRing';

// Mood
import { MoodBadge } from '@/components/MoodBadge';
import { MoodSelectorCard } from '@/components/MoodSelectorCard';
import { EmojiAsset, type EmojiName } from '@/components/EmojiAsset';

// Toggles & Switches
import { SkeuoToggle } from '@/components/SkeuoToggle';
import { NeumorphicSwitch } from '@/components/NeumorphicSwitch';
import { NeuCheck } from '@/components/NeuCheck';
import { SettingsRow } from '@/components/SettingsRow';

// Dial
import { MoodDial } from '@/components/MoodDial';

// Onboarding
import { Logo } from '@/components/Logo';
import { OnboardingTitle } from '@/components/OnboardingTitle';
import { OnboardingBody } from '@/components/OnboardingBody';
import { UserName } from '@/components/UserName';
import { ContactInfo } from '@/components/ContactInfo';

const moods: Mood[] = ['moody', 'great', 'bad', 'neutral'];
const PLACEHOLDER_AVATAR = 'https://i.pravatar.cc/150?img=32';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

function MoodSwitcher() {
  const { mood, setMood, themed } = useMood();
  return (
    <View style={styles.moodSwitcher}>
      {moods.map((m) => (
        <Pressable
          key={m}
          onPress={() => setMood(m)}
          style={[
            styles.moodPill,
            {
              backgroundColor:
                mood === m ? themed(themeColors.accent) : '#F0EEEC',
            },
          ]}
        >
          <Text
            style={[
              styles.moodPillText,
              { color: mood === m ? '#fff' : '#5C4A3D' },
            ]}
          >
            {m}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function Gallery() {
  const { themed } = useMood();
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [neuCheck, setNeuCheck] = useState(false);
  const [settingsVal, setSettingsVal] = useState(true);
  const [selectedMood, setSelectedMood] = useState(1);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: themed(themeColors.surfacePrimary) },
      ]}
      contentContainerStyle={styles.content}
    >
      <Logo />
      <Text style={styles.pageTitle}>Component Gallery</Text>
      <Text style={styles.pageSubtitle}>
        Switch moods to see themed variations
      </Text>

      <MoodSwitcher />

      <View style={{ gap: 8, marginBottom: 32 }}>
        <Link href="/color-docs" style={styles.docLink}>
          <Text style={styles.docLinkText}>Color System Documentation →</Text>
        </Link>
        <Link href="/architecture" style={[styles.docLink, { backgroundColor: '#FAFAF8', borderWidth: 1, borderColor: '#E0E0E0' }]}>
          <Text style={[styles.docLinkText, { color: '#1A1A1A' }]}>Component Architecture →</Text>
        </Link>
        <Link href="/mood-dial" style={[styles.docLink, { backgroundColor: '#3D2117' }]}>
          <Text style={styles.docLinkText}>MoodDial Preview →</Text>
        </Link>
        <Link href="/home" style={[styles.docLink, { backgroundColor: '#C4982E' }]}>
          <Text style={styles.docLinkText}>Home Screen →</Text>
        </Link>
      </View>

      {/* ─── ONBOARDING ─── */}
      <Section title="Onboarding">
        <View style={styles.centered}>
          <OnboardingTitle text={'Stay close,\neven far apart!'} />
          <View style={{ height: 12 }} />
          <OnboardingBody text="A quiet connection with the people who matter! No awkward calls, just peace of mind." />
        </View>
      </Section>

      {/* ─── BUTTONS ─── */}
      <Section title="Buttons">
        <ButtonPrimary label="Primary" onPress={() => {}} />
        <ButtonSecondary label="Secondary" onPress={() => {}} />
        <ButtonGhost label="Ghost" onPress={() => {}} />
        <ButtonPrimary label="Disabled" onPress={() => {}} disabled />
        <ButtonPrimaryIcon
          label="Continue with Apple"
          icon={<Text style={{ fontSize: 20 }}>🍎</Text>}
          onPress={() => {}}
        />
        <ButtonSecondaryIcon
          label="Continue with Google"
          icon={<Text style={{ fontSize: 20 }}>🔍</Text>}
          onPress={() => {}}
        />
      </Section>

      {/* ─── INPUTS ─── */}
      <Section title="Inputs">
        <InputLabel text="Full Name" />
        <InputField placeholder="Enter your name" />
        <View style={{ height: 8 }} />
        <InputLabel text="Email (Focused)" />
        <InputField placeholder="you@example.com" state="focus" />
        <View style={{ height: 8 }} />
        <InputLabel text="Error State" />
        <InputField
          placeholder="Invalid input"
          state="error"
          errorMessage="This field is required"
        />
        <View style={{ height: 8 }} />
        <InputLabel text="Disabled" />
        <InputField placeholder="Can't edit" state="disabled" />
        <View style={{ height: 8 }} />
        <InputHint text="We'll never share your info" />
        <View style={{ height: 16 }} />
        <LabeledInput placeholder="Combined label + input" hint="With hint text" />
      </Section>

      {/* ─── AVATARS & PROFILES ─── */}
      <Section title="Avatars & Profiles">
        <View style={styles.row}>
          <AvatarRing uri={PLACEHOLDER_AVATAR} size={48} />
          <AvatarRing uri={PLACEHOLDER_AVATAR} size={64} />
          <AvatarRing uri={PLACEHOLDER_AVATAR} size={80} />
        </View>
        <View style={{ height: 16 }} />
        <UserName name="Alex Johnson" />
        <ContactInfo contact="+1 (555) 123-4567" />
        <View style={{ height: 16 }} />
        <UserProfile
          avatarUri={PLACEHOLDER_AVATAR}
          name="Alex Johnson"
          contact="+1 (555) 123-4567"
        />
      </Section>

      {/* ─── CARDS ─── */}
      <Section title="Cards">
        <CardSurface width={320} height={100}>
          <Text style={{ fontSize: 14, color: '#5C4A3D' }}>Basic CardSurface</Text>
        </CardSurface>
        <MoodCard
          title="Today's Mood"
          body="Feeling creative and inspired"
          width={320}
        />
        <UserProfileCard
          avatarUri={PLACEHOLDER_AVATAR}
          name="Alex Johnson"
          contact="+1 (555) 123-4567"
        />
        <ContactCard
          avatarUri={PLACEHOLDER_AVATAR}
          name="Alex Johnson"
          contact="+1 (555) 123-4567"
          moodLabel="Good"
          moodEmojiName="smile"
        />
      </Section>

      {/* ─── MOOD COMPONENTS ─── */}
      <Section title="Mood Components">
        <View style={styles.row}>
          <EmojiAsset name="smile" size={52} />
          <EmojiAsset name="expressionless" size={52} />
          <EmojiAsset name="angry" size={52} />
          <EmojiAsset name="woozy" size={52} />
        </View>
        <View style={styles.row}>
          <MoodBadge label="Good" emojiName="smile" />
          <MoodBadge label="Sad" emojiName="expressionless" />
        </View>
        <View style={styles.row}>
          <MoodBadge variant="timer" timerValue="24:98" />
          <MoodBadge variant="emojiOnly" label="Good" emojiName="smile" />
        </View>
        <View style={[styles.row, { gap: 12 }]}>
          {(['smile', 'expressionless', 'angry', 'woozy'] as EmojiName[]).map((emojiName, i) => (
            <MoodSelectorCard
              key={i}
              emojiName={emojiName}
              label={['Good', 'Sad', 'Angry', 'Neutral'][i]}
              category="Emotion"
              selected={selectedMood === i}
              onPress={() => setSelectedMood(i)}
            />
          ))}
        </View>
      </Section>

      {/* ─── MOOD DIAL ─── */}
      <Section title="Mood Dial">
        <View style={styles.centered}>
          <MoodDial size={340} />
        </View>
      </Section>

      {/* ─── TOGGLES & SWITCHES ─── */}
      <Section title="Toggles & Switches">
        <View style={styles.row}>
          <Text style={styles.toggleLabel}>Skeuo Toggle</Text>
          <SkeuoToggle value={toggle1} onValueChange={setToggle1} />
        </View>
        <View style={styles.row}>
          <Text style={styles.toggleLabel}>Neumorphic Switch</Text>
          <NeumorphicSwitch value={toggle2} onValueChange={setToggle2} />
        </View>
        <View style={styles.centered}>
          <NeuCheck checked={neuCheck} onPress={() => setNeuCheck(!neuCheck)} />
        </View>
        <SettingsRow
          label="Notifications"
          description="Get notified about mood updates"
          value={settingsVal}
          onValueChange={setSettingsVal}
        />
      </Section>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2b0902',
    letterSpacing: -1,
    marginTop: 16,
  },
  pageSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8c827e',
    marginTop: 4,
    marginBottom: 20,
  },
  moodSwitcher: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  moodPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  moodPillText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  docLink: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 32,
    alignSelf: 'stretch',
  },
  docLinkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: 36,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8c827e',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  sectionContent: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  centered: {
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#5C4A3D',
    minWidth: 140,
  },
});
