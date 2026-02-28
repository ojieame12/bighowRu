import React from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { useMood } from '@/constants/MoodContext';
import { themeColors } from '@/constants/tokens';
import { IconAsset } from './IconAsset';

type Props = {
  date?: string;
  time?: string;
  location?: string;
};

export function CheckInMeta({ date, time, location }: Props) {
  const { themed, mood } = useMood();
  const isBad = mood === 'bad';
  const textColor = isBad ? '#FFFFFFCC' : themed(themeColors.moodTextSecondary);
  const accentColor = isBad ? '#FFFFFF' : themed(themeColors.accent);
  const borderColor = isBad ? '#FFFFFF30' : themed(themeColors.borderSubtle);

  if (!date && !time && !location) return null;

  const openMaps = () => {
    if (!location) return;
    const q = encodeURIComponent(location);
    Linking.openURL(`https://maps.apple.com/?q=${q}`).catch(() =>
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`)
    );
  };

  return (
    <View style={[styles.strip, { borderColor }]}>
      <View style={styles.left}>
        {date != null && (
          <View style={styles.segment}>
            <IconAsset name="calendar" size={14} color={textColor} />
            <Text style={[styles.text, { color: textColor }]}>{date}</Text>
          </View>
        )}
        {date != null && time != null && (
          <Text style={[styles.dot, { color: textColor }]}>·</Text>
        )}
        {time != null && (
          <View style={styles.segment}>
            <IconAsset name="clock" size={14} color={textColor} />
            <Text style={[styles.text, { color: textColor }]}>{time}</Text>
          </View>
        )}
      </View>
      {location != null && (
        <Pressable onPress={openMaps} style={styles.segment}>
          <IconAsset name="pin" size={14} color={accentColor} />
          <Text style={[styles.locationText, { color: accentColor }]}>
            {location}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  text: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 14,
    fontWeight: '500',
  },
  locationText: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  dot: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.35,
  },
});
