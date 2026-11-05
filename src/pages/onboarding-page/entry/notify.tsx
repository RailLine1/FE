import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { requestNotificationPermission } from '../notificationPermission';
import { HOME_ROUTE } from '../session';

// P-NOTI-01
export default function NotifyPage() {
  const router = useRouter();
  const enter = () => router.replace(HOME_ROUTE);

  const allow = async () => {
    await requestNotificationPermission();
    enter();
  };

  return (
    <Screen>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
        <View style={styles.main}>
          <View style={styles.bell}>
            <Image source={require('@/assets/icons/bell-white-48.png')} style={styles.bellIcon} />
          </View>
          <Text accessibilityRole="header" style={styles.title}>
            {'필요한 알림만\n과목별로 받아요'}
          </Text>
          <Text style={styles.subtitle}>과목마다 켜고 끌 수 있어요.</Text>

          <View style={styles.preview}>
            <View style={styles.previewIcon}>
              <Text style={styles.previewLetter}>D</Text>
            </View>
            <View style={styles.previewText}>
              <Text style={styles.previewTitle}>Daybit</Text>
              <Text style={styles.previewBody}>운영체제 · 오늘의 한 조각이 준비됐어요</Text>
            </View>
            <Text style={styles.previewTime}>지금</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Button label="알림 받기" onPress={allow} />
          <Button label="나중에" variant="text" onPress={enter} />
        </View>
      </ScrollView>
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
    paddingTop: 56,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: Palette.purple,
    boxShadow: `0 5px 0 ${Palette.purpleShadow}`,
  },
  bellIcon: {
    width: 48,
    height: 48,
  },
  title: {
    ...Fonts.black,
    marginTop: 24,
    fontSize: 28,
    lineHeight: 35,
    letterSpacing: -0.6,
    textAlign: 'center',
    color: Palette.text,
  },
  subtitle: {
    ...Fonts.regular,
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22.5,
    textAlign: 'center',
    color: Palette.textSub,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    alignSelf: 'stretch',
    height: 75,
    marginTop: 24,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: Palette.line,
  },
  previewIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Palette.purple,
  },
  previewLetter: {
    ...Fonts.black,
    fontSize: 15,
    lineHeight: 22.5,
    color: Palette.white,
  },
  previewText: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  previewTitle: {
    ...Fonts.bold,
    fontSize: 14,
    lineHeight: 21,
    color: Palette.text,
  },
  previewBody: {
    ...Fonts.regular,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.textSub,
  },
  previewTime: {
    ...Fonts.semiBold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
  actions: {
    gap: 8,
  },
});
