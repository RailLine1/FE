import { useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

// 커넥터 목록을 다시 불러와도 전체 주소가 지워지지 않게 따로 보관한다. 저장하지 않으므로 새로고침하면 사라진다.
export const ISSUED_URL_KEY = ['connectorIssuedUrl'];

// P-AI-02. 전체 주소는 발급 직후 이 화면에서만 보여 준다.
export default function ConnectorIssuedPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [url] = useState(() => queryClient.getQueryData<string>(ISSUED_URL_KEY));
  const [copied, setCopied] = useState(false);

  const goToList = () => {
    queryClient.removeQueries({ queryKey: ISSUED_URL_KEY });
    router.dismissTo('/profile/connector');
  };

  const goToGuide = () => {
    queryClient.removeQueries({ queryKey: ISSUED_URL_KEY });
    if (router.canGoBack()) router.back();
    else router.replace('/profile/connector');
  };

  const copy = async () => {
    if (!url) return;
    await Clipboard.setStringAsync(url);
    setCopied(true);
  };

  return (
    <Screen>
      <AppBar
        title="내 커넥터 주소"
        leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: goToList }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {url ? (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>새 주소가 발급됐어요</Text>
              <View style={styles.code}>
                <Text selectable style={styles.url}>
                  {url}
                </Text>
              </View>
              <Button label={copied ? '복사했어요' : '주소 복사'} onPress={copy} />
            </View>
            <View style={styles.warning}>
              <Image
                source={require('@/assets/icons/warning-golden-20.png')}
                style={styles.warningIcon}
              />
              <Text style={styles.warningText}>
                전체 주소는 지금 한 번만 보여요. 이 화면을 나가면 다시 볼 수 없으니 지금 AI 설정에
                붙여넣어 주세요. 이전 주소는 더 이상 동작하지 않아요.
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.warning}>
            <Image
              source={require('@/assets/icons/warning-golden-20.png')}
              style={styles.warningIcon}
            />
            <Text style={styles.warningText}>
              전체 주소는 발급 직후에만 볼 수 있어요. 잃어버렸다면 새로 발급해 주세요.
            </Text>
          </View>
        )}
        <View style={styles.spacer} />
        <Button label="등록 방법 보기" variant="secondary" onPress={goToGuide} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 14,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  card: {
    gap: 10,
    padding: 16,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: Palette.purple,
    boxShadow: `0 3px 0 ${Palette.purpleShadow}`,
  },
  label: {
    ...Fonts.bold,
    fontSize: 11,
    lineHeight: 16.5,
    letterSpacing: 1,
    color: Palette.purpleStrong,
  },
  code: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Palette.line,
    backgroundColor: Palette.surfaceMuted,
  },
  url: {
    ...Fonts.regular,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.text,
  },
  warning: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: Palette.goldenTint,
  },
  warningIcon: {
    width: 20,
    height: 20,
  },
  warningText: {
    ...Fonts.bold,
    flex: 1,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.text,
  },
  spacer: {
    flex: 1,
  },
});
