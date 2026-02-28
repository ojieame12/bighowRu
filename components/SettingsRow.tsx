import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SkeuoToggle } from './SkeuoToggle';
import { useMood } from '@/constants/MoodContext';
import { themeColors, typography } from '@/constants/tokens';

type Props = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
};

/**
 * Settings row – label + optional description on the left, SkeuoToggle on the right.
 * 320 wide, vertically centered, 12px vertical padding.
 */
export function SettingsRow({ label, description, value, onValueChange }: Props) {
  const { themed } = useMood();

  return (
    <View style={styles.row}>
      <View style={styles.labels}>
        <Text
          style={[
            styles.label,
            { color: themed(themeColors.moodTextPrimary) },
          ]}
        >
          {label}
        </Text>
        {description ? (
          <Text
            style={[
              styles.description,
              { color: themed(themeColors.moodTextSecondary) },
            ]}
          >
            {description}
          </Text>
        ) : null}
      </View>
      <SkeuoToggle value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: 320,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 12,
  },
  labels: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontFamily: typography.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
  },
  description: {
    fontFamily: typography.fontFamily,
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    opacity: 0.7,
  },
});
