import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { useMood } from '@/constants/MoodContext';
import { themeColors } from '@/constants/tokens';
import { AvatarRing } from './AvatarRing';

type Props = {
  avatarUri: string;
  name: string;
  contact: string;
  avatarSize?: number;
  style?: ViewStyle;
};

export function UserProfile({
  avatarUri,
  name,
  contact,
  avatarSize = 72,
  style,
}: Props) {
  const { themed } = useMood();
  const nameColor = themed(themeColors.moodTextPrimary);
  const contactColor = themed(themeColors.moodTextSecondary);

  return (
    <View style={[styles.container, style]}>
      <AvatarRing uri={avatarUri} size={avatarSize} />
      <View style={styles.userInfo}>
        <Text style={[styles.name, { color: nameColor }]}>{name}</Text>
        <Text style={[styles.contact, { color: contactColor }]}>
          {contact}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  userInfo: {
    gap: 0,
  },
  name: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  contact: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 19,
    fontWeight: '600',
    opacity: 0.45,
  },
});
