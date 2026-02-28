import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

// Live components
import { AvatarRing } from '@/components/AvatarRing';
import { UserName } from '@/components/UserName';
import { ContactInfo } from '@/components/ContactInfo';
import { EmojiAsset } from '@/components/EmojiAsset';
import { MoodBadge } from '@/components/MoodBadge';
import { ContactCard } from '@/components/ContactCard';

const AVATAR_URL = 'https://i.pravatar.cc/150?img=32';

// ─── Data ───

const MATRIX_ROWS = [
  { state: 'Moody', stateColor: '#C4982E', theme: 'moody', label: '"Moody"', emoji: 'Expressionless (mbCaW)', badge: 'MoodBadge' },
  { state: 'Good', stateColor: '#2E8B57', theme: 'great', label: '"Good"', emoji: 'Smile (S3qT0)', badge: 'MoodBadge' },
  { state: 'Fine', stateColor: '#2E8B57', theme: 'great', label: '"Fine"', emoji: 'Smile (S3qT0)', badge: 'MoodBadge' },
  { state: 'Great', stateColor: '#2E8B57', theme: 'great', label: '"Great"', emoji: 'Care/Hearts (VZBzN)', badge: 'MoodBadge' },
  { state: 'Bad', stateColor: '#C43E55', theme: 'bad', label: '"Bad"', emoji: 'Angry Face (N2F7P)', badge: 'MoodBadge' },
  { state: 'Angry', stateColor: '#C43E55', theme: 'bad', label: '"Angry"', emoji: 'Angry Red (n3dm2)', badge: 'MoodBadge' },
  { state: 'Sad', stateColor: '#C43E55', theme: 'bad', label: '"Sad"', emoji: 'Expressionless (mbCaW)', badge: 'MoodBadge' },
  { state: 'Not Checked In', stateColor: '#787878', theme: 'neutral', label: '—', labelColor: '#AAAAAA', emoji: '— (no emoji)', emojiColor: '#AAAAAA', badge: 'MoodBadge/Timer', badgeColor: '#787878', isLast: true },
];

const RULES = [
  { num: '01', numColor: '#C4982E', text: 'Timer badge = always neutral theme (person hasn\'t checked in yet)', textColor: '#5C4A3D', bg: '#FFF8F0', border: '#F0E0D0' },
  { num: '02', numColor: '#2E8B57', text: 'Every non-timer badge MUST show label + emoji (no emoji-only badges)', textColor: '#2D5A3D', bg: '#F0FFF4', border: '#D0F0D8' },
  { num: '03', numColor: '#C43E55', text: 'Emoji art must match mood state — swap MoodEmojiSmall path art from asset library (frame kgLDU)', textColor: '#5C2D35', bg: '#FFF0F0', border: '#F0D0D4' },
  { num: '04', numColor: '#3949AB', text: 'Theme is set on ContactCard instance via theme prop — all children inherit $mood-* variables automatically', textColor: '#2D3058', bg: '#F0F0FF', border: '#D8D8F0' },
];

const TOKENS = [
  { name: '$mood-card-start', desc: 'Card gradient top' },
  { name: '$mood-card-end', desc: 'Card gradient bottom' },
  { name: '$mood-shadow', desc: 'Card drop shadow' },
  { name: '$mood-text-primary', desc: 'Name text color' },
  { name: '$mood-text-secondary', desc: 'Email text color' },
  { name: '$accent', desc: 'Badge label color' },
  { name: '$mood-mesh-anchor', desc: 'Background mesh color' },
  { name: '$border-focus', desc: 'Focus ring color' },
];

const ATOMS = [
  { label: 'AvatarRing', id: 'rxTGl', desc: 'Circular avatar with theme-colored ring stroke. Contains avatar-image frame (photo fill) and ring-track ellipse.' },
  { label: 'UserName', id: 'Sa1Rl', desc: 'Display name label. Props: fontSize, fontWeight, fill (uses $mood-text-primary).' },
  { label: 'ContactInfo', id: '4hCKQ', desc: 'Email/contact label. Props: fontSize, fontWeight, fill (uses $mood-text-secondary), opacity.' },
  { label: 'MoodEmojiSmall', id: 'itiyr', desc: '24.5px pre-scaled emoji art. Swap path art per mood state. Used inside MoodBadge molecule.' },
];

// ─── Sub-components ───

function Divider() {
  return <View style={s.divider} />;
}

function Badge({ text, color, bg, width }: { text: string; color: string; bg: string; width?: number }) {
  return (
    <View style={[s.badge, { backgroundColor: bg, width: width || undefined }]}>
      <Text style={[s.badgeText, { color }]}>{text}</Text>
    </View>
  );
}

function SectionHeader({ badge, badgeColor, badgeBg, badgeWidth, desc }: { badge: string; badgeColor: string; badgeBg: string; badgeWidth?: number; desc: string }) {
  return (
    <View style={s.sectionHeader}>
      <Badge text={badge} color={badgeColor} bg={badgeBg} width={badgeWidth} />
      <Text style={s.sectionDesc}>{desc}</Text>
    </View>
  );
}

function DocCard({ children }: { children: React.ReactNode }) {
  return <View style={s.docCard}>{children}</View>;
}

// ─── Main Page ───

export default function Architecture() {
  return (
    <ScrollView style={s.page} contentContainerStyle={s.pageContent}>
      <View style={s.card}>

        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.title}>howRU — Component Architecture</Text>
          <Text style={s.subtitle}>Atomic Design System: Atoms → Molecules → Organisms</Text>
        </View>

        <Divider />

        {/* ── ATOMS ── */}
        <View style={s.section}>
          <SectionHeader badge="ATOMS" badgeColor="#2E8B57" badgeBg="#E8F5E9" badgeWidth={100} desc="Smallest indivisible UI elements" />
          <View style={s.grid4}>
            {ATOMS.map((atom, i) => (
              <DocCard key={atom.id}>
                <Text style={s.cardLabel}>{atom.label}</Text>
                <Text style={s.cardId}>ID: {atom.id}</Text>
                <Text style={s.cardDesc}>{atom.desc}</Text>
                {/* Live previews */}
                {i === 0 && <AvatarRing uri={AVATAR_URL} size={64} />}
                {i === 1 && <UserName name="Olivia" />}
                {i === 2 && <ContactInfo contact="olivia@email.com" />}
                {i === 3 && <EmojiAsset name="smile" size={24} />}
              </DocCard>
            ))}
          </View>
        </View>

        <Divider />

        {/* ── MOLECULES ── */}
        <View style={s.section}>
          <SectionHeader badge="MOLECULES" badgeColor="#C4982E" badgeBg="#FFF3E0" badgeWidth={140} desc="Composed of atoms — functional UI groups" />
          <View style={s.grid2}>
            <DocCard>
              <Text style={s.cardLabel}>MoodBadge</Text>
              <Text style={s.cardId}>ID: zLwXd</Text>
              <Text style={s.cardDesc}>Label + Emoji badge. Horizontal flexbox, centered, 6px gap, pill shape (cornerRadius 193). Uses $accent for label color. Contains: mood-label (text) + MoodEmojiSmall (atom).</Text>
              <Text style={[s.cardNote, { color: '#2E8B57' }]}>Atoms: mood-label (text) + MoodEmojiSmall</Text>
              <MoodBadge label="Good" emojiName="smile" />
            </DocCard>
            <DocCard>
              <Text style={s.cardLabel}>MoodBadge / Timer</Text>
              <Text style={s.cardId}>ID: iY5d0</Text>
              <Text style={s.cardDesc}>Timer-only badge for 'not checked in' state. Shows countdown text (Dotmax font, 26px). Always uses neutral theme. No emoji — only timer text centered in pill.</Text>
              <Text style={[s.cardNote, { color: '#C43E55' }]}>Rule: Timer badge = always neutral theme</Text>
              <MoodBadge variant="timer" timerValue="24:98" />
            </DocCard>
          </View>
        </View>

        <Divider />

        {/* ── ORGANISM ── */}
        <View style={s.section}>
          <SectionHeader badge="ORGANISM" badgeColor="#7B2EAD" badgeBg="#F3E8FF" badgeWidth={140} desc="Complete, self-contained UI unit" />
          <View style={s.orgRow}>
            <DocCard>
              <Text style={s.cardLabel}>ContactCard</Text>
              <Text style={s.cardId}>ID: N24z0</Text>
              <Text style={s.cardDesc}>Full contact card with mood-themed gradient background and shadow. Composed of top-row (AvatarRing + badge-slot) and user-info (UserName + ContactInfo).</Text>
              <Text style={[s.cardNote, { color: '#C4982E' }]}>Molecules: MoodBadge OR MoodBadge/Timer (via badge-slot)</Text>
              <Text style={[s.cardNote, { color: '#2E8B57' }]}>Atoms: AvatarRing + UserName + ContactInfo</Text>
            </DocCard>
            <View style={s.orgPreview}>
              <ContactCard
                avatarUri={AVATAR_URL}
                name="Olivia"
                contact="olivia@email.com"
                moodLabel="Good"
                moodEmojiName="smile"
              />
            </View>
          </View>
        </View>

        <Divider />

        {/* ── STATE MATRIX ── */}
        <View style={s.section}>
          <SectionHeader badge="STATE MATRIX" badgeColor="#3949AB" badgeBg="#E8EAF6" badgeWidth={160} desc="Mood → Theme → Label → Emoji mapping rules" />
          <View style={s.matrixTable}>
            {/* Header */}
            <View style={[s.matrixRow, s.matrixHeaderRow]}>
              <Text style={[s.matrixHeaderText, { width: 140 }]}>State</Text>
              <Text style={[s.matrixHeaderText, { width: 120 }]}>Theme</Text>
              <Text style={[s.matrixHeaderText, { width: 120 }]}>Label</Text>
              <Text style={[s.matrixHeaderText, { width: 200 }]}>Emoji Asset</Text>
              <Text style={[s.matrixHeaderText, { flex: 1 }]}>Badge Type</Text>
            </View>
            {/* Rows */}
            {MATRIX_ROWS.map((row) => (
              <View
                key={row.state}
                style={[
                  s.matrixRow,
                  s.matrixDataRow,
                  row.isLast && { backgroundColor: '#FAFAFA' },
                ]}
              >
                <Text style={[s.matrixStateText, { width: 140, color: row.stateColor }]}>{row.state}</Text>
                <Text style={[s.matrixCellText, { width: 120 }]}>{row.theme}</Text>
                <Text style={[s.matrixCellText, { width: 120, color: row.labelColor || '#444444' }]}>{row.label}</Text>
                <Text style={[s.matrixCellSmall, { width: 200, color: row.emojiColor || '#444444' }]}>{row.emoji}</Text>
                <Text style={[s.matrixCellSmall, { flex: 1, color: row.badgeColor || '#444444', fontWeight: row.isLast ? '600' : '500' }]}>{row.badge}</Text>
              </View>
            ))}
          </View>
        </View>

        <Divider />

        {/* ── RULES ── */}
        <View style={s.section}>
          <SectionHeader badge="RULES" badgeColor="#C43E55" badgeBg="#FCE4EC" badgeWidth={100} desc="Constraints that must always hold true" />
          <View style={s.grid2}>
            {RULES.slice(0, 2).map((rule) => (
              <View key={rule.num} style={[s.ruleCard, { backgroundColor: rule.bg, borderColor: rule.border }]}>
                <Text style={[s.ruleNum, { color: rule.numColor }]}>{rule.num}</Text>
                <Text style={[s.ruleText, { color: rule.textColor }]}>{rule.text}</Text>
              </View>
            ))}
          </View>
          <View style={s.grid2}>
            {RULES.slice(2, 4).map((rule) => (
              <View key={rule.num} style={[s.ruleCard, { backgroundColor: rule.bg, borderColor: rule.border }]}>
                <Text style={[s.ruleNum, { color: rule.numColor }]}>{rule.num}</Text>
                <Text style={[s.ruleText, { color: rule.textColor }]}>{rule.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <Divider />

        {/* ── DESIGN TOKENS ── */}
        <View style={s.section}>
          <SectionHeader badge="DESIGN TOKENS" badgeColor="#00838F" badgeBg="#E0F7FA" badgeWidth={160} desc="Theme-reactive variables (mood axis)" />
          <View style={s.grid4}>
            {TOKENS.slice(0, 4).map((tok) => (
              <View key={tok.name} style={s.tokenCard}>
                <Text style={s.tokenName}>{tok.name}</Text>
                <Text style={s.tokenDesc}>{tok.desc}</Text>
              </View>
            ))}
          </View>
          <View style={s.grid4}>
            {TOKENS.slice(4, 8).map((tok) => (
              <View key={tok.name} style={s.tokenCard}>
                <Text style={s.tokenName}>{tok.name}</Text>
                <Text style={s.tokenDesc}>{tok.desc}</Text>
              </View>
            ))}
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

// ─── Styles ───

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F2F2F7' },
  pageContent: { padding: 32, alignItems: 'center' },
  card: {
    backgroundColor: '#FAFAF8',
    borderRadius: 24,
    padding: 48,
    width: '100%',
    maxWidth: 1200,
    gap: 48,
  },

  header: { gap: 8 },
  title: { fontFamily: 'SF Pro Rounded', fontSize: 36, fontWeight: '700', color: '#1A1A1A', letterSpacing: -0.5 },
  subtitle: { fontFamily: 'SF Pro Rounded', fontSize: 18, fontWeight: '500', color: '#787878', letterSpacing: -0.2 },

  divider: { height: 1, backgroundColor: '#E0E0E0', width: '100%' },

  section: { gap: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionDesc: { fontFamily: 'SF Pro Rounded', fontSize: 14, fontWeight: '500', color: '#999999' },

  badge: { height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: 'SF Pro Rounded', fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },

  grid4: { flexDirection: 'row', gap: 24 },
  grid2: { flexDirection: 'row', gap: 24 },

  docCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  cardLabel: { fontFamily: 'SF Pro Rounded', fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  cardId: { fontFamily: 'SF Pro Rounded', fontSize: 11, fontWeight: '500', color: '#999999' },
  cardDesc: { fontFamily: 'SF Pro Rounded', fontSize: 12, fontWeight: '400', color: '#666666', lineHeight: 12 * 1.4 },
  cardNote: { fontFamily: 'SF Pro Rounded', fontSize: 11, fontWeight: '600' },

  orgRow: { flexDirection: 'row', gap: 24 },
  orgPreview: {
    width: 382,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  // Matrix
  matrixTable: { borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0', overflow: 'hidden', backgroundColor: '#FFFFFF' },
  matrixRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  matrixHeaderRow: { backgroundColor: '#F5F5F5', height: 44 },
  matrixDataRow: { height: 40, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  matrixHeaderText: { fontFamily: 'SF Pro Rounded', fontSize: 12, fontWeight: '700', color: '#666666', letterSpacing: 0.5 },
  matrixStateText: { fontFamily: 'SF Pro Rounded', fontSize: 13, fontWeight: '600' },
  matrixCellText: { fontFamily: 'SF Pro Rounded', fontSize: 13, fontWeight: '500', color: '#444444' },
  matrixCellSmall: { fontFamily: 'SF Pro Rounded', fontSize: 12, fontWeight: '500', color: '#444444' },

  // Rules
  ruleCard: { flex: 1, borderRadius: 12, padding: 16, gap: 8, borderWidth: 1 },
  ruleNum: { fontFamily: 'SF Pro Rounded', fontSize: 24, fontWeight: '700', opacity: 0.3 },
  ruleText: { fontFamily: 'SF Pro Rounded', fontSize: 13, fontWeight: '500', lineHeight: 13 * 1.4 },

  // Tokens
  tokenCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  tokenName: { fontFamily: 'SF Pro Rounded', fontSize: 11, fontWeight: '600', color: '#1A1A1A' },
  tokenDesc: { fontFamily: 'SF Pro Rounded', fontSize: 10, fontWeight: '400', color: '#999999' },
});
