import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { MoodProvider } from '@/constants/MoodContext';

function injectWebFonts() {
  if (Platform.OS !== 'web') return;

  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'SF Pro Rounded';
      src: url('/assets/assets/SF-Pro-Rounded-Bold.otf') format('opentype');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'SF Pro Rounded';
      src: url('/assets/assets/SF-Pro-Rounded-Bold.otf') format('opentype');
      font-weight: 500;
      font-style: normal;
    }
    @font-face {
      font-family: 'SF Pro Rounded';
      src: url('/assets/assets/SF-Pro-Rounded-Bold.otf') format('opentype');
      font-weight: 600;
      font-style: normal;
    }
    @font-face {
      font-family: 'SF Pro Rounded';
      src: url('/assets/assets/SF-Pro-Rounded-Bold.otf') format('opentype');
      font-weight: 700;
      font-style: normal;
    }
    @font-face {
      font-family: 'SF Pro Rounded';
      src: url('/assets/assets/SF-Pro-Rounded-Heavy.otf') format('opentype');
      font-weight: 800;
      font-style: normal;
    }
    @font-face {
      font-family: 'SF Pro Rounded';
      src: url('/assets/assets/SF-Pro-Rounded-Heavy.otf') format('opentype');
      font-weight: 900;
      font-style: normal;
    }
    @font-face {
      font-family: 'Dotmax';
      src: url('/assets/assets/Dotmax.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
    }
  `;
  document.head.appendChild(style);
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SF Pro Rounded': require('@/assets/SF-Pro-Rounded-Bold.otf'),
    'Dotmax': require('@/assets/Dotmax.ttf'),
  });

  useEffect(() => {
    injectWebFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3D2117" />
      </View>
    );
  }

  return (
    <MoodProvider initialMood="neutral">
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </MoodProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
});
