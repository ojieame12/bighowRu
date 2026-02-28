import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
} from 'react-native';
import { colors } from '@/constants/tokens';
import { IconAsset } from './IconAsset';

type Props = {
  uri?: string;
  name?: string;
  onRequestSelfie?: () => void;
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

function SecondaryButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.button,
        {
          backgroundColor: pressed
            ? colors.btnSecondaryPressed
            : '#FFFFFF',
        },
      ]}
    >
      {icon}
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

export function SelfieStrip({ uri, name, onRequestSelfie }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (uri) {
    return (
      <>
        <SecondaryButton
          icon={<IconAsset name="camera" size={16} color={colors.btnSecondaryText} />}
          label="View Selfie"
          onPress={() => setLightboxOpen(true)}
        />

        <Modal
          visible={lightboxOpen}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setLightboxOpen(false)}
        >
          <Pressable
            style={styles.lightbox}
            onPress={() => setLightboxOpen(false)}
          >
            <View style={styles.lightboxImageWrap}>
              <Image
                source={{ uri }}
                style={styles.lightboxImage}
                resizeMode="contain"
              />
            </View>
          </Pressable>
        </Modal>
      </>
    );
  }

  return (
    <SecondaryButton
      icon={<IconAsset name="camera" size={16} color={colors.btnSecondaryText} />}
      label={`Nudge ${name ?? 'them'} for a selfie`}
      onPress={onRequestSelfie ?? (() => {})}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonLabel: {
    fontFamily: 'SF Pro Rounded',
    fontSize: 16,
    fontWeight: '600',
    color: colors.btnSecondaryText,
  },
  lightbox: {
    flex: 1,
    backgroundColor: '#000000E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightboxImageWrap: {
    width: SCREEN_W - 40,
    height: SCREEN_H * 0.7,
    borderRadius: 24,
    overflow: 'hidden',
  },
  lightboxImage: {
    width: '100%',
    height: '100%',
  },
});
