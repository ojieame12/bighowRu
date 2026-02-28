import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Data extracted from howru.pen M9jiH ───

const VARIABLE_TABLE = [
  {
    name: '$mood-mesh-anchor',
    purpose: 'Background mesh gradient anchor',
    values: { moody: '#F2C76B', great: '#6BF299', bad: '#F26B87', neutral: '#C4C3C4' },
  },
  {
    name: '$mood-card-start',
    purpose: 'Card gradient start color',
    values: { moody: '#FFFFFF', great: '#FFFFFF', bad: '#FFE4E4', neutral: '#FFFFFF' },
  },
  {
    name: '$mood-card-end',
    purpose: 'Card gradient end color',
    values: { moody: '#FFE7BE', great: '#BEFFD8', bad: '#FF9E9E', neutral: '#EBEBEB' },
  },
  {
    name: '$mood-shadow',
    purpose: 'Card drop shadow color (25% alpha)',
    values: { moody: '#AD952A40', great: '#A5D0A040', bad: '#AD2A2A40', neutral: '#A7A7A740' },
  },
  {
    name: '$mood-text-primary',
    purpose: 'Primary text / headings',
    values: { moody: '#320903', great: '#045D32', bad: '#5C0417', neutral: '#220601' },
  },
  {
    name: '$mood-text-secondary',
    purpose: 'Secondary text / subtitles',
    values: { moody: '#90816F', great: '#94B6A6', bad: '#B5939A', neutral: '#C4C3C4' },
  },
];

const SURFACE_TABLE = [
  { name: '$surface-primary', purpose: 'Page / screen background', moody: '#FFFCF7', great: '#F8FFFA', bad: '#FFF8F8', neutral: '#FAFAFA' },
  { name: '$surface-secondary', purpose: 'Card / elevated surface fill', moody: '#F7F1E8', great: '#EDF7F1', bad: '#F7EDEE', neutral: '#F0F0F0' },
  { name: '$input-bg', purpose: 'Input field resting fill', moody: '#F5F0E8', great: '#EBF5EE', bad: '#F5EBEC', neutral: '#EEEEEE' },
  { name: '$input-bg-focus', purpose: 'Input field focused fill', moody: '#FFFFFF', great: '#FFFFFF', bad: '#FFFFFF', neutral: '#FFFFFF' },
  { name: '$border-subtle', purpose: 'Light dividers & input borders', moody: '#E8DFD0', great: '#D0E8DA', bad: '#E8D0D4', neutral: '#DEDEDE' },
  { name: '$border-focus', purpose: 'Input focus ring color', moody: '#D4B87A', great: '#7AD4A0', bad: '#D47A8E', neutral: '#B0B0B0' },
  { name: '$error / $error-bg', purpose: 'Error stroke & error field background', moody: '#C44040', great: '#C44040', bad: '#C44040', neutral: '#C44040' },
];

const BUTTON_TABLE = [
  { name: '$btn-primary-bg', purpose: 'Primary button fill', value: '#3D2117' },
  { name: '$btn-primary-pressed', purpose: 'Primary pressed state', value: '#2A160F' },
  { name: '$btn-primary-text', purpose: 'Text on primary button', value: '#FFFFFF' },
  { name: '$btn-primary-shadow', purpose: 'Primary button shadow', value: '#3D211730' },
  { name: '$btn-secondary-bg', purpose: 'Secondary button fill', value: '#FFFFFF80' },
  { name: '$btn-secondary-border', purpose: 'Secondary button stroke', value: '#E0D8D0' },
  { name: '$btn-secondary-text', purpose: 'Text on secondary button', value: '#5C4A3D' },
  { name: '$btn-ghost-text', purpose: 'Ghost button text', value: '#8E7060' },
  { name: '$btn-disabled-bg', purpose: 'Disabled button fill', value: '#F0EEEC' },
  { name: '$btn-disabled-text', purpose: 'Disabled button text', value: '#C0B8B0' },
];

const MOOD_PALETTES = [
  {
    name: 'Moody',
    gradient: ['#FFFFFF', '#FFE7BE'] as [string, string],
    dot: '#F2C76B',
    textColor: '#320903',
    swatches: ['#F2C76B', '#FFFFFF', '#FFE7BE', '#AD952A40', '#320903', '#90816F'],
  },
  {
    name: 'Great',
    gradient: ['#FFFFFF', '#BEFFD8'] as [string, string],
    dot: '#6BF299',
    textColor: '#045D32',
    swatches: ['#6BF299', '#FFFFFF', '#BEFFD8', '#A5D0A040', '#045D32', '#94B6A6'],
  },
  {
    name: 'Bad',
    gradient: ['#FFE4E4', '#FF9E9E'] as [string, string],
    dot: '#F26B87',
    textColor: '#5C0417',
    swatches: ['#F26B87', '#FFE4E4', '#FF9E9E', '#AD2A2A40', '#5C0417', '#B5939A'],
  },
  {
    name: 'Neutral',
    gradient: ['#FFFFFF', '#EBEBEB'] as [string, string],
    dot: '#C4C3C4',
    textColor: '#220601',
    swatches: ['#C4C3C4', '#FFFFFF', '#EBEBEB', '#A7A7A740', '#220601', '#C4C3C4'],
  },
];

const SWATCH_LABELS = ['mesh-anchor', 'card-start', 'card-end', 'shadow', 'text-primary', 'text-secondary'];

const EXAMPLES = [
  { tag: 'Text Fill', code: 'fill: "$mood-text-primary"', codeColor: '#6BF299', desc: 'Binds the text fill color to the primary text variable. Resolves to dark tones matching the active mood.' },
  { tag: 'Shadow', code: 'effect.color: "$mood-shadow"', codeColor: '#F2C76B', desc: 'Binds the shadow color to the mood shadow variable. Each mood gets a tinted, semi-transparent shadow.' },
  { tag: 'Card BG', code: 'gradient.start: "$mood-card-start"\ngradient.end: "$mood-card-end"', codeColor: '#F26B87', desc: 'Bind both gradient stops to mood card variables for a smooth, theme-aware card background.' },
];

// ─── Reusable sub-components ───

function Divider() {
  return <View style={s.divider} />;
}

function SectionLabel({ text }: { text: string }) {
  return <Text style={s.sectionLabel}>{text}</Text>;
}

function SectionTitle({ text }: { text: string }) {
  return <Text style={s.sectionTitle}>{text}</Text>;
}

function SectionDesc({ text }: { text: string }) {
  return <Text style={s.sectionDesc}>{text}</Text>;
}

function Swatch({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        borderWidth: 1,
        borderColor: '#E8E8ED',
      }}
    />
  );
}

function TableHeader({ cells }: { cells: string[] }) {
  return (
    <View style={[s.tableRow, s.tableHeaderRow]}>
      {cells.map((c, i) => (
        <Text key={i} style={[s.tableHeaderText, i === 0 && s.tableCellWide, i === 1 && s.tableCellMed]}>
          {c}
        </Text>
      ))}
    </View>
  );
}

// ─── Main Page ───

export default function ColorDocs() {
  return (
    <ScrollView style={s.page} contentContainerStyle={s.pageContent}>
      <View style={s.card}>
        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.versionBadge}>
            <Text style={s.versionText}>v3</Text>
          </View>
          <Text style={s.titleText}>Color System Documentation</Text>
          <Text style={s.subtitleText}>
            A complete reference of the mood-driven color variables powering the HowRU design. Each variable is theme-aware — it resolves to a different color depending on the active mood: Moody, Great, Bad, or Neutral.
          </Text>
        </View>

        <Divider />

        {/* ── Theme Axis ── */}
        <View style={s.section}>
          <SectionLabel text="THEME AXIS" />
          <SectionTitle text="mood" />
          <SectionDesc text="The single theme axis that controls all color variables. Four possible values:" />
          <View style={s.moodPillsRow}>
            {MOOD_PALETTES.map((m) => (
              <LinearGradient
                key={m.name}
                colors={m.gradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={s.moodPill}
              >
                <View style={s.moodPillInner}>
                  <Swatch color={m.dot} size={14} />
                  <Text style={[s.moodPillText, { color: m.textColor }]}>
                    {m.name.toLowerCase()}
                  </Text>
                </View>
              </LinearGradient>
            ))}
          </View>
        </View>

        <Divider />

        {/* ── Variable Reference ── */}
        <View style={s.section}>
          <SectionLabel text="VARIABLE REFERENCE" />
          <SectionDesc text="All 6 color variables with their resolved values per mood. Use the $variable-name syntax to bind any property to these tokens." />
          <View style={s.table}>
            <View style={[s.tableRow, s.tableHeaderRow]}>
              <Text style={[s.tableHeaderText, s.tableCellWide]}>Variable Name</Text>
              {['Moody', 'Great', 'Bad', 'Neutral'].map((m, i) => (
                <View key={m} style={[s.tableHeaderCell]}>
                  <Swatch color={MOOD_PALETTES[i].dot} size={10} />
                  <Text style={s.tableHeaderText}>{m}</Text>
                </View>
              ))}
            </View>
            {VARIABLE_TABLE.map((row, idx) => (
              <View key={row.name}>
                {idx > 0 && <View style={s.rowSep} />}
                <View style={[s.tableRow, { backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }]}>
                  <View style={s.tableCellWide}>
                    <Text style={s.varName}>{row.name}</Text>
                    <Text style={s.varPurpose}>{row.purpose}</Text>
                  </View>
                  {(['moody', 'great', 'bad', 'neutral'] as const).map((mood) => (
                    <View key={mood} style={s.tableCellColor}>
                      <Swatch color={row.values[mood]} />
                      <Text style={s.hexText}>{row.values[mood]}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <Divider />

        {/* ── Mood Palettes ── */}
        <View style={s.section}>
          <SectionLabel text="MOOD PALETTES" />
          <SectionDesc text="Each mood defines a cohesive palette. The colors flow from the background mesh through card gradients, shadows, and into typography — creating a unified emotional atmosphere." />
          <View style={s.paletteGrid}>
            {MOOD_PALETTES.map((p) => (
              <View key={p.name} style={s.paletteCard}>
                <LinearGradient
                  colors={p.gradient}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={s.paletteHeader}
                >
                  <View style={[s.paletteDot, { backgroundColor: p.dot }]} />
                  <Text style={[s.paletteName, { color: p.textColor }]}>{p.name}</Text>
                </LinearGradient>
                <View style={s.paletteBody}>
                  {p.swatches.map((color, i) => (
                    <View key={i} style={s.paletteSwatchRow}>
                      <View style={[s.paletteSwatchRect, { backgroundColor: color }]} />
                      <Text style={s.paletteSwatchLabel}>{SWATCH_LABELS[i]}</Text>
                      <Text style={s.paletteSwatchHex}>{color}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <Divider />

        {/* ── Usage Guidelines ── */}
        <View style={s.section}>
          <SectionLabel text="USAGE GUIDELINES" />
          <Text style={s.usageTitle}>How to bind variables</Text>
          <SectionDesc text='Use the $ prefix to bind any color property to a mood variable. The value will automatically resolve based on the active theme.' />
          <View style={s.examplesRow}>
            {EXAMPLES.map((ex) => (
              <View key={ex.tag} style={s.exampleCard}>
                <View style={s.exampleTag}>
                  <Text style={s.exampleTagText}>{ex.tag}</Text>
                </View>
                <View style={s.exampleCode}>
                  <Text style={[s.exampleCodeText, { color: ex.codeColor }]}>{ex.code}</Text>
                </View>
                <Text style={s.exampleDesc}>{ex.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <Divider />

        {/* ── Footer ── */}
        <View style={s.footer}>
          <Text style={s.footerLeft}>
            See also: Design-System-v2 / Mood Themes for the interactive matrix view with live component previews.
          </Text>
          <View style={s.footerRight}>
            {['#F2C76B', '#6BF299', '#F26B87', '#C4C3C4'].map((c) => (
              <View key={c} style={[s.footerDot, { backgroundColor: c }]} />
            ))}
            <Text style={s.footerVersion}>v3.0</Text>
          </View>
        </View>

        <Divider />

        {/* ── Surface & Input Tokens ── */}
        <View style={s.section}>
          <SectionLabel text="SURFACE & INPUT TOKENS" />
          <SectionDesc text="Mood-aware tokens for backgrounds, input fields, and borders. These create the warm, pillow-soft feel across form elements." />
          <View style={s.table}>
            <View style={[s.tableRow, s.tableHeaderRow]}>
              <Text style={[s.tableHeaderTextSm, s.tableCellWide]}>Token</Text>
              <Text style={[s.tableHeaderTextSm, s.tableCellMed]}>Purpose</Text>
              {['Moody', 'Great', 'Bad', 'Neutral'].map((m, i) => (
                <View key={m} style={s.tableHeaderCell}>
                  <Swatch color={MOOD_PALETTES[i].dot} size={10} />
                  <Text style={s.tableHeaderTextSm}>{m}</Text>
                </View>
              ))}
            </View>
            {SURFACE_TABLE.map((row, idx) => (
              <View key={row.name}>
                {idx > 0 && <View style={s.rowSep} />}
                <View style={[s.tableRow, { backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }]}>
                  <Text style={[s.varNameSmall, s.tableCellWide]}>{row.name}</Text>
                  <Text style={[s.varPurposeSmall, s.tableCellMed]}>{row.purpose}</Text>
                  {(['moody', 'great', 'bad', 'neutral'] as const).map((mood) => (
                    <View key={mood} style={s.tableCellColor}>
                      <Swatch color={(row as any)[mood]} />
                      <Text style={s.hexText}>{(row as any)[mood]}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <Divider />

        {/* ── Brand Button Tokens ── */}
        <View style={s.section}>
          <SectionLabel text="BRAND BUTTON TOKENS" />
          <SectionDesc text="Fixed-color tokens for buttons. These do NOT change with mood — the warm brown pill anchors the UI across all themes, matching the app's Checkup button style." />
          <View style={s.table}>
            <View style={[s.tableRow, s.tableHeaderRow]}>
              <Text style={[s.tableHeaderTextSm, s.tableCellWide]}>Token</Text>
              <Text style={[s.tableHeaderTextSm, s.tableCellMed]}>Purpose</Text>
              <Text style={[s.tableHeaderTextSm, { flex: 1 }]}>Value</Text>
              <Text style={[s.tableHeaderTextSm, { width: 48 }]}>Swatch</Text>
            </View>
            {BUTTON_TABLE.map((row, idx) => (
              <View key={row.name}>
                {idx > 0 && <View style={s.rowSep} />}
                <View style={[s.tableRow, { backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }]}>
                  <Text style={[s.varNameSmall, s.tableCellWide]}>{row.name}</Text>
                  <Text style={[s.varPurposeSmall, s.tableCellMed]}>{row.purpose}</Text>
                  <Text style={[s.hexText, { flex: 1 }]}>{row.value}</Text>
                  <View style={{ width: 48, alignItems: 'center' }}>
                    <Swatch color={row.value} />
                  </View>
                </View>
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
  page: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  pageContent: {
    padding: 32,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 48,
    width: '100%',
    maxWidth: 1200,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 40,
  },

  // Header
  header: {
    gap: 8,
  },
  versionBadge: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  versionText: {
    color: '#FFFFFF',
    fontFamily: 'SF Pro Rounded',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  titleText: {
    color: '#3D2117',
    fontFamily: 'SF Pro Rounded',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitleText: {
    color: '#6E6E73',
    fontFamily: 'SF Pro Rounded',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 14 * 1.55,
  },

  // Shared
  divider: {
    height: 1,
    backgroundColor: '#E8E8ED',
    width: '100%',
  },
  section: {
    gap: 16,
  },
  sectionLabel: {
    color: '#8E8E93',
    fontFamily: 'SF Pro Rounded',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  sectionTitle: {
    color: '#3D2117',
    fontFamily: 'SF Pro Rounded',
    fontSize: 22,
    fontWeight: '700',
  },
  sectionDesc: {
    color: '#6E6E73',
    fontFamily: 'SF Pro Rounded',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 13 * 1.5,
  },

  // Mood Pills
  moodPillsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  moodPill: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  moodPillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moodPillText: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 14,
    fontWeight: '600',
  },

  // Tables
  table: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8ED',
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  tableHeaderRow: {
    backgroundColor: '#F5F5F7',
    paddingVertical: 12,
  },
  tableHeaderCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tableHeaderText: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 1,
  },
  tableCellWide: {
    flex: 2,
  },
  tableCellMed: {
    flex: 1.5,
  },
  tableCellColor: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowSep: {
    height: 1,
    backgroundColor: '#F0F0F2',
  },
  varName: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 13,
    fontWeight: '600',
    color: '#3D2117',
  },
  varNameSmall: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 12,
    fontWeight: '600',
    color: '#3D2117',
  },
  varPurpose: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 10,
    fontWeight: '400',
    color: '#8E8E93',
  },
  varPurposeSmall: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 11,
    fontWeight: '400',
    color: '#6E6E73',
  },
  hexText: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 11,
    fontWeight: '500',
    color: '#3D2117',
  },

  // Palettes
  paletteGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  paletteCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8ED',
    overflow: 'hidden',
  },
  paletteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  paletteDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  paletteName: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 18,
    fontWeight: '700',
  },
  paletteBody: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
  },
  paletteSwatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  paletteSwatchRect: {
    width: 32,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E8E8ED',
  },
  paletteSwatchLabel: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 11,
    fontWeight: '500',
    color: '#8E8E93',
    flex: 1,
  },
  paletteSwatchHex: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 10,
    fontWeight: '500',
    color: '#AEAEB2',
  },
  usageTitle: {
    color: '#3D2117',
    fontFamily: 'SF Pro Rounded',
    fontSize: 20,
    fontWeight: '700',
  },
  tableHeaderTextSm: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.8,
  },

  // Examples
  examplesRow: {
    flexDirection: 'row',
    gap: 16,
  },
  exampleCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#F9F9FB',
    borderWidth: 1,
    borderColor: '#E8E8ED',
    padding: 20,
    gap: 12,
  },
  exampleTag: {
    backgroundColor: '#1A1A2E',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  exampleTagText: {
    color: '#FFFFFF',
    fontFamily: 'SF Pro Rounded',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  exampleCode: {
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  exampleCodeText: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  exampleDesc: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 11,
    fontWeight: '400',
    color: '#6E6E73',
    lineHeight: 11 * 1.45,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 11,
    fontWeight: '400',
    color: '#8E8E93',
    maxWidth: 700,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  footerVersion: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
  },
});
