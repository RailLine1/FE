import { PermissionsAndroid, Platform } from 'react-native';

import { registerPushToken } from '@/lib/pushNotifications';

// P-NOTI-01. 거절하거나 실패해도 다음 화면으로 넘어간다.
// 허용하면 기기 토큰을 POST /push/tokens로 등록한다. 기다리지 않고 다음 화면으로 간다.
export async function requestNotificationPermission() {
  try {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      registerPushToken();
    } else if (Platform.OS === 'web' && typeof Notification !== 'undefined') {
      await Notification.requestPermission();
    }
  } catch {
    // 권한은 나중에 설정에서 바꿀 수 있다.
  }
}
