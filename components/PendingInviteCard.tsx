import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { typography } from '@/constants/tokens';

type Props = {
  name: string;
  initials: string;
  sentAgo: string;
  onResend?: () => void;
};

export function PendingInviteCard({ name, initials, sentAgo, onResend }: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.card}>
      {/* Top row: avatar + name/status + resend */}
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.status}>Invited {sentAgo}</Text>
        </View>
        <Pressable
          onPress={onResend}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          style={[styles.resendBtn, pressed && styles.resendPressed]}
        >
          <Text style={styles.resendText}>Resend</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D8D5D0',
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: '#FAFAF8',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEECE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: typography.fontFamily,
    fontSize: 17,
    fontWeight: '700',
    color: '#A09890',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: typography.fontFamily,
    fontSize: 18,
    fontWeight: '600',
    color: '#3D2117',
    letterSpacing: -0.2,
  },
  status: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '500',
    color: '#B0A8A0',
  },
  resendBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4E0',
  },
  resendPressed: {
    backgroundColor: '#F5F0EC',
  },
  resendText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#5C4A3D',
  },
});
