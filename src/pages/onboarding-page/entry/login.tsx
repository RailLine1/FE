import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useLogin } from '@/api/1-인증/1-인증';
import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';
import { pendingRoute } from '@/lib/pendingRoute';

import { FormErrors, githubErrorMessage, toFormErrors, validateLogin } from '../authForm';
import { openGithubLogin, startSession } from '../session';

export default function LoginPage() {
  const router = useRouter();
  const { error: githubError } = useLocalSearchParams<{ error?: string }>();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const login = useLogin();

  const formError = errors.form ?? (githubError && githubErrorMessage(githubError));

  const submit = () => {
    const found = validateLogin({ loginId, password });
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    login.mutate(
      { data: { loginId, password } },
      {
        onSuccess: async ({ tokens, isFirstLogin }) => {
          await startSession(tokens);
          router.replace(isFirstLogin ? '/onboarding' : (pendingRoute.take() ?? '/welcome'));
        },
        onError: (error) => setErrors(toFormErrors(error)),
      },
    );
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.flex}
          contentContainerStyle={styles.content}>
          <View style={styles.mark}>
            <Text style={styles.markLetter}>D</Text>
          </View>
          <Text accessibilityRole="header" style={styles.logo}>
            Daybit
          </Text>
          <Text style={styles.tagline}>강의자료로 하는 나만의 공부</Text>

          <View style={styles.fields}>
            <FormField
              label="아이디"
              placeholder="아이디"
              autoCapitalize="none"
              autoCorrect={false}
              value={loginId}
              error={errors.loginId}
              onChangeText={setLoginId}
            />
            <FormField
              label="비밀번호"
              placeholder="비밀번호"
              secureTextEntry
              value={password}
              error={errors.password}
              onChangeText={setPassword}
              onSubmitEditing={submit}
            />
          </View>

          <Button
            label="로그인"
            disabled={login.isPending}
            onPress={submit}
            style={styles.submit}
          />
          {formError && <Text style={styles.formError}>{formError}</Text>}

          <Text style={styles.signup}>
            계정이 없나요?{' '}
            <Link href="/signup" style={styles.signupLink}>
              회원가입
            </Link>
          </Text>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerLabel}>SNS 계정으로 시작</Text>
            <View style={styles.line} />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="GitHub으로 계속하기"
            onPress={openGithubLogin}
            style={styles.github}>
            <Image source={require('@/assets/icons/github-26.png')} style={styles.githubIcon} />
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 102,
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Palette.purple,
    boxShadow: `0 4px 0 ${Palette.purpleShadow}`,
  },
  markLetter: {
    ...Fonts.black,
    fontSize: 30,
    lineHeight: 45,
    color: Palette.white,
  },
  logo: {
    ...Fonts.black,
    marginTop: 12,
    fontSize: 32,
    lineHeight: 48,
    letterSpacing: -1.5,
    textAlign: 'center',
    color: Palette.text,
  },
  tagline: {
    ...Fonts.regular,
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22.5,
    textAlign: 'center',
    color: Palette.textSub,
  },
  fields: {
    gap: 14,
    marginTop: 35.5,
  },
  submit: {
    marginTop: 24,
  },
  formError: {
    ...Fonts.semiBold,
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: Palette.red,
  },
  signup: {
    ...Fonts.regular,
    marginTop: 16,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    color: Palette.textSub,
  },
  signupLink: {
    ...Fonts.bold,
    color: Palette.purpleStrong,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 31,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: Palette.line,
  },
  dividerLabel: {
    ...Fonts.bold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
  github: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 56,
    height: 56,
    marginTop: 16,
    borderWidth: 2,
    borderRadius: 28,
    borderColor: Palette.lineStrong,
    backgroundColor: Palette.surface,
    boxShadow: `0 3px 0 ${Palette.lineStrong}`,
  },
  // 검은 GitHub 마크를 어두운 테마 글자색으로 칠한다.
  githubIcon: {
    width: 26,
    height: 26,
    tintColor: Palette.text,
  },
});
