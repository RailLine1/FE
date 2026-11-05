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

import { useUpdate } from '@/api/2-내-정보/2-내-정보';
import { AppBar } from '@/components/AppBar';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { tokenStorage } from '@/lib/tokenStorage';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { FormErrors, toFormErrors, validateNickname } from '../authForm';

// P-ACC-04. GitHub 첫 로그인
export default function NicknamePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const update = useUpdate();

  const submit = () => {
    const invalid = validateNickname(nickname);
    setErrors({ nickname: invalid });
    if (invalid) return;

    update.mutate(
      { data: { nickname } },
      {
        onSuccess: () => router.replace('/onboarding'),
        onError: (error) => setErrors(toFormErrors(error)),
      },
    );
  };

  const cancel = async () => {
    await tokenStorage.clear();
    router.replace('/login');
  };

  return (
    <Screen>
      <AppBar
        borderless
        leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: cancel }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.flex}
          contentContainerStyle={styles.content}>
          <View style={styles.heading}>
            <Text accessibilityRole="header" style={styles.title}>
              닉네임 설정
            </Text>
            <Text style={styles.subtitle}>Daybit에서 쓸 닉네임을 정해 주세요.</Text>
          </View>
          <View style={styles.github}>
            <Icon name="github-20" />
            <Text style={styles.githubLabel}>GitHub 계정으로 로그인했어요</Text>
            <View>
              <Badge label="연결됨" variant="success" />
            </View>
          </View>
          <FormField
            autoFocus
            label="닉네임"
            placeholder="2~12자, 한글·영문·숫자"
            hint="이미 쓰는 닉네임이면 저장되지 않아요."
            value={nickname}
            error={errors.nickname}
            onChangeText={setNickname}
            onSubmitEditing={submit}
          />
          <View style={styles.spacer} />
          {errors.form && <Text style={styles.formError}>{errors.form}</Text>}
          <Button label="다음" disabled={update.isPending} onPress={submit} />
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
  heading: {
    gap: 5,
    marginBottom: 10,
  },
  title: {
    ...Fonts.black,
    fontSize: 32,
    lineHeight: 48,
    letterSpacing: -0.8,
    color: Palette.text,
  },
  subtitle: {
    ...Fonts.regular,
    fontSize: 15,
    lineHeight: 22.5,
    color: Palette.textSub,
  },
  github: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 54,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: Palette.line,
    backgroundColor: Palette.surfaceMuted,
  },
  githubLabel: {
    ...Fonts.bold,
    flex: 1,
    fontSize: 13,
    lineHeight: 19.5,
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
});
