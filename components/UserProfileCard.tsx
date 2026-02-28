import React from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMood } from '@/constants/MoodContext';
import { themeColors } from '@/constants/tokens';
import { UserProfile } from './UserProfile';

type Props = {
  avatarUri: string;
  name: string;
  contact: string;
  style?: ViewStyle;
};

export function UserProfileCard({ avatarUri, name, contact, style }: Props) {
  const { themed } = useMood();
  const gradientStart = themed(themeColors.moodCardStart);
  const gradientEnd = themed(themeColors.moodCardEnd);
  const shadowColor = themed(themeColors.moodShadow);

  return (
    <LinearGradient
      colors={[gradientStart, gradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.card, { shadowColor }, style]}
    >
      <UserProfile
        avatarUri={avatarUri}
        name={name}
        contact={contact}
        avatarSize={41}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
});
