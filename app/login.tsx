import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthActions } from '@convex-dev/auth/react';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { ButtonGhost } from '@/components/ButtonGhost';
import { InputField } from '@/components/InputField';
import { InputLabel } from '@/components/InputLabel';
import LogoSvg from '@/assets/logo.svg';
import { typography } from '@/constants/tokens';

type Flow = 'signIn' | 'signUp';

export default function LoginScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<Flow>('signIn');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (flow === 'signUp') {
        await signIn('password', { email, password, name, flow: 'signUp' });
      } else {
        await signIn('password', { email, password, flow: 'signIn' });
      }
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FAFAFA', '#F0F0F0']}
      style={styles.screen}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.logoWrap}>
            <LogoSvg width={120} height={50} />
          </View>

          <Text style={styles.title}>
            {flow === 'signIn' ? 'Welcome back' : 'Create account'}
          </Text>
          <Text style={styles.subtitle}>
            {flow === 'signIn'
              ? 'Sign in to check on your people'
              : 'Start your peace of mind journey'}
          </Text>

          <View style={styles.form}>
            {flow === 'signUp' && (
              <>
                <InputLabel text="Name" />
                <InputField
                  placeholder="Your name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
                <View style={styles.spacer} />
              </>
            )}

            <InputLabel text="Email" />
            <InputField
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.spacer} />

            <InputLabel text="Password" />
            <InputField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              state={error ? 'error' : undefined}
              errorMessage={error || undefined}
            />

            <View style={styles.buttonWrap}>
              <ButtonPrimary
                label={loading ? '...' : flow === 'signIn' ? 'Sign In' : 'Sign Up'}
                onPress={handleSubmit}
                disabled={loading || !email || !password}
              />
            </View>

            <ButtonGhost
              label={
                flow === 'signIn'
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Sign In'
              }
              onPress={() => {
                setFlow(flow === 'signIn' ? 'signUp' : 'signIn');
                setError('');
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  content: {
    paddingTop: 80,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: 32,
    fontWeight: '700',
    color: '#320903',
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8078',
    marginBottom: 32,
  },
  form: {
    gap: 4,
  },
  spacer: { height: 12 },
  buttonWrap: {
    marginTop: 24,
    marginBottom: 12,
  },
});
