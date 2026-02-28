import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { ConvexReactClient } from 'convex/react';
import { ConvexAuthProvider, useConvexAuth } from '@convex-dev/auth/react';
import { useQuery, useMutation } from 'convex/react';
import * as SecureStore from 'expo-secure-store';
import { MoodProvider } from '@/constants/MoodContext';
import { CircleProvider } from '@/constants/CircleContext';
import { api } from '@/convex/_generated/api';

// ── Convex client ──
const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL!,
  { unsavedChangesWarning: false }
);

// ── Platform-aware secure storage for auth tokens ──
const secureStorage = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

// ── Web font injection ──
function injectWebFonts() {
  if (Platform.OS !== 'web') return;
  const style = document.createElement('style');
  style.textContent = `
    @font-face { font-family: 'SF Pro Rounded'; src: url('/assets/assets/SF-Pro-Rounded-Bold.otf') format('opentype'); font-weight: 400; }
    @font-face { font-family: 'SF Pro Rounded'; src: url('/assets/assets/SF-Pro-Rounded-Bold.otf') format('opentype'); font-weight: 500; }
    @font-face { font-family: 'SF Pro Rounded'; src: url('/assets/assets/SF-Pro-Rounded-Bold.otf') format('opentype'); font-weight: 600; }
    @font-face { font-family: 'SF Pro Rounded'; src: url('/assets/assets/SF-Pro-Rounded-Bold.otf') format('opentype'); font-weight: 700; }
    @font-face { font-family: 'SF Pro Rounded'; src: url('/assets/assets/SF-Pro-Rounded-Heavy.otf') format('opentype'); font-weight: 800; }
    @font-face { font-family: 'SF Pro Rounded'; src: url('/assets/assets/SF-Pro-Rounded-Heavy.otf') format('opentype'); font-weight: 900; }
    @font-face { font-family: 'Dotmax'; src: url('/assets/assets/Dotmax.ttf') format('truetype'); font-weight: 400; }
  `;
  document.head.appendChild(style);
}

// ── Auth-gated inner layout ──
function AuthGate() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const router = useRouter();
  const segments = useSegments();

  const appState = useQuery(
    api.bootstrap.getMyState,
    isAuthenticated ? {} : 'skip'
  );
  const initUser = useMutation(api.bootstrap.initUser);

  // Auto-bootstrap new users
  useEffect(() => {
    if (appState?.needsBootstrap) {
      initUser();
    }
  }, [appState?.needsBootstrap, initUser]);

  // Navigation guard
  useEffect(() => {
    if (authLoading) return;

    const onLoginPage = segments[0] === 'login';

    if (!isAuthenticated && !onLoginPage) {
      router.replace('/login');
    } else if (isAuthenticated && onLoginPage) {
      router.replace('/home');
    }
  }, [isAuthenticated, authLoading, segments, router]);

  if (authLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3D2117" />
      </View>
    );
  }

  // Not authenticated — show login stack
  if (!isAuthenticated) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  // Waiting for bootstrap
  if (!appState || appState.needsBootstrap) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3D2117" />
      </View>
    );
  }

  return (
    <CircleProvider
      activeCircleId={appState.activeCircleId ?? null}
      userId={appState.userId ?? null}
    >
      <MoodProvider initialMood="neutral">
        <Stack screenOptions={{ headerShown: false }} />
      </MoodProvider>
    </CircleProvider>
  );
}

// ── Root layout ──
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
    <ConvexAuthProvider client={convex} storage={secureStorage}>
      <AuthGate />
    </ConvexAuthProvider>
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
