import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MoodDial } from '@/components/MoodDial';
import { EmojiAsset, type EmojiName } from '@/components/EmojiAsset';

type MoodSelection = { name: EmojiName; label: string };
type Selections = Record<string, MoodSelection>;

const PHASE_LABELS = ['Feeling', 'Health', 'Energy', 'Social'];

export default function MoodDialPreview() {
  const router = useRouter();
  const [result, setResult] = useState<Selections | null>(null);
  const [positivity, setPositivity] = useState<number | null>(null);

  const handleComplete = (selections: Selections, pos: number) => {
    setResult(selections);
    setPositivity(pos);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>MoodDial</Text>
      <Text style={styles.subtitle}>
        Tap the fingerprint, then drag to select across {PHASE_LABELS.length} phases
      </Text>

      <View style={styles.dialWrapper}>
        <MoodDial onComplete={handleComplete} />
      </View>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Your check-in</Text>
          {positivity !== null && (
            <Text style={styles.positivityText}>
              Positivity: {(positivity * 100).toFixed(0)}%
            </Text>
          )}
          <View style={styles.resultRow}>
            {PHASE_LABELS.map((label) => {
              const key = label.toLowerCase();
              const sel = result[key];
              if (!sel) return null;
              return (
                <ResultItem key={key} label={label} selection={sel} />
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

function ResultItem({
  label,
  selection,
}: {
  label: string;
  selection: MoodSelection;
}) {
  return (
    <View style={styles.resultItem}>
      <EmojiAsset name={selection.name} size={36} />
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>{selection.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  back: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D2117',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2b0902',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8c827e',
    marginTop: 4,
    marginBottom: 48,
    textAlign: 'center',
  },
  dialWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  resultContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2b0902',
    marginBottom: 8,
  },
  positivityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8c827e',
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  resultItem: {
    alignItems: 'center',
    gap: 4,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8c827e',
    marginTop: 4,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3D2117',
  },
});
