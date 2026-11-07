import * as Notifications from 'expo-notifications';
import { router, type Href } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { register, unregister } from '@/api/9-알림/9-알림';
import { notificationRoute } from '@/lib/notificationRoute';
import { tokenStorage } from '@/lib/tokenStorage';

// BE는 FCM으로 보낸다. 웹 푸시와 iOS(APNs)는 아직 받지 않는다.
const isPushDevice = Platform.OS === 'android';
// app.json의 expo-notifications defaultChannel과 같아야 한다.
const CHANNEL_ID = 'default';

// 시안 64. 앱을 쓰는 중에 와도 화면 위 배너로 보여준다.
if (isPushDevice) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function deviceToken() {
  if (!isPushDevice) return null;
  const { granted } = await Notifications.getPermissionsAsync();
  if (!granted) return null;
  // 잠금 화면과 앱 사용 중에 배너로 뜨려면 중요도가 높은 채널이 있어야 한다.
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: '오늘의 한 조각',
    // 빌드된 enum을 lint가 읽지 못한다. 타입 검사는 통과한다.
    // eslint-disable-next-line import/namespace
    importance: Notifications.AndroidImportance.HIGH,
  });
  const { data } = await Notifications.getDevicePushTokenAsync();
  return typeof data === 'string' ? data : null;
}

// 앱 시작, 로그인, 알림 허용 때마다 보낸다. BE가 같은 토큰은 갱신한다.
// ponytail: 토큰이 바뀌는 순간은 따로 듣지 않는다. 다음 앱 시작 때 다시 등록된다.
export async function registerPushToken() {
  try {
    const token = await deviceToken();
    if (token) await register({ token, platform: 'android' });
  } catch {
    // 알림은 부가 기능이라 실패해도 앱 사용을 막지 않는다.
  }
}

// 로그아웃 전에 부른다. 토큰을 지워야 다른 계정 알림이 이 기기로 오지 않는다.
export async function unregisterPushToken() {
  try {
    const token = await deviceToken();
    if (token) await unregister({ token });
  } catch {
    // 서버가 무효 토큰을 정리하므로 실패해도 로그아웃은 계속한다.
  }
}

function openFrom(response: Notifications.NotificationResponse | null) {
  const route = notificationRoute(response?.notification.request.content.data);
  if (route) router.push(route as Href);
}

// 로그인 상태면 토큰을 등록하고, 알림을 눌러 들어오면 해당 화면으로 보낸다.
// 내비게이터가 마운트된 뒤에만 이동할 수 있어 ready로 기다린다.
export function usePushNotifications(ready: boolean) {
  useEffect(() => {
    if (!ready || !isPushDevice) return;
    tokenStorage.get().then((tokens) => {
      if (tokens) registerPushToken();
    });

    // 앱이 꺼진 상태에서 알림을 눌러 열린 경우
    Notifications.getLastNotificationResponseAsync().then((response) => {
      openFrom(response);
      Notifications.clearLastNotificationResponseAsync();
    });
    const subscription = Notifications.addNotificationResponseReceivedListener(openFrom);
    return () => subscription.remove();
  }, [ready]);
}
