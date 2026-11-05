import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useSignup } from '@/api/1-인증/1-인증';
import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { FormErrors, toFormErrors, validateSignup } from '../authForm';
import { startSession } from '../session';

// P-ACC-02~04
export default function SignupPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const signup = useSignup();

  const goToLogin = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/login');
  };

  const submit = () => {
    const found = validateSignup({ loginId, password, passwordConfirm, nickname });
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    signup.mutate(
      { data: { loginId, password, nickname } },
      {
        onSuccess: async ({ tokens }) => {
          await startSession(tokens);
          // 뒤로 가기로 로그인 화면에 돌아가지 않게 아래에 쌓인 화면을 비운다.
          if (router.canDismiss()) router.dismissAll();
          router.replace('/onboarding');
        },
        onError: (error) => setErrors(toFormErrors(error)),
      },
    );
  };

  return (
    <Screen>
      <AppBar
        borderless
        leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: goToLogin }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.flex}
          contentContainerStyle={styles.content}>
          <Text accessibilityRole="header" style={styles.title}>
            회원가입
          </Text>
          <FormField
            label="아이디"
            placeholder="4~20자, 영문 소문자·숫자"
            autoCapitalize="none"
            autoCorrect={false}
            value={loginId}
            error={errors.loginId}
            onChangeText={setLoginId}
          />
          <FormField
            label="비밀번호"
            placeholder="8자 이상"
            secureTextEntry
            value={password}
            error={errors.password}
            onChangeText={setPassword}
          />
          <FormField
            label="비밀번호 확인"
            placeholder="한 번 더 입력"
            secureTextEntry
            value={passwordConfirm}
            error={errors.passwordConfirm}
            onChangeText={setPasswordConfirm}
          />
          <FormField
            label="닉네임"
            placeholder="2~12자, 한글·영문·숫자"
            hint="다른 사람에게는 아이디 대신 닉네임이 보여요."
            value={nickname}
            error={errors.nickname}
            onChangeText={setNickname}
          />
          <View style={styles.spacer} />
          {errors.form && <Text style={styles.formError}>{errors.form}</Text>}
          <Button label="가입하기" disabled={signup.isPending} onPress={submit} />
          <Text style={styles.login}>
            이미 계정이 있나요?{' '}
            <Text accessibilityRole="link" onPress={goToLogin} style={styles.loginLink}>
              로그인
            </Text>
          </Text>
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
    gap: 14,
    paddingTop: 8,
  },
  title: {
    ...Fonts.black,
    marginBottom: 10,
    fontSize: 32,
    lineHeight: 48,
    letterSpacing: -0.8,
    color: Palette.text,
  },
  spacer: {
    flex: 1,
  },
  formError: {
    ...Fonts.semiBold,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: Palette.red,
  },
  login: {
    ...Fonts.regular,
    fontSize: 13,
    lineHeight: 19.5,
    textAlign: 'center',
    color: Palette.textSub,
  },
  loginLink: {
    ...Fonts.bold,
    color: Palette.purpleStrong,
    textDecorationLine: 'underline',
  },
});
