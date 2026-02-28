import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import InviteSvg from '@/assets/icons/invite.svg';
import { typography } from '@/constants/tokens';

type Props = {
  onPress?: () => void;
};

export function InviteStickerCard({ onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.shadowOuter}>
        <View style={styles.shadowInner}>
          <LinearGradient
            colors={['#FFE0C0', '#FF9E6B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <InviteSvg width={48} height={48} />
            <View style={styles.textWrap}>
              <Text style={styles.heading}>Invite someone new</Text>
              <Text style={styles.subtitle}>Share your peace of mind</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadowOuter: {
    borderRadius: 32,
    shadowColor: '#D4692040',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    shadowOpacity: 1,
    elevation: 8,
  },
  shadowInner: {
    borderRadius: 32,
    shadowColor: '#D4692030',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 4,
  },
  card: {
    borderRadius: 32,
    paddingVertical: 28,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  textWrap: {
    flex: 1,
    gap: 3,
  },
  heading: {
    fontFamily: typography.fontFamily,
    fontSize: 20,
    fontWeight: '700',
    color: '#3D2117',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: '500',
    color: '#6B3A1A',
    opacity: 0.7,
  },
});
