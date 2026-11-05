import { PermissionsAndroid, Platform } from 'react-native';

// P-NOTI-01. 거절하거나 실패해도 다음 화면으로 넘어간다.
// ponytail: 권한 요청까지만 한다. Firebase 설정이 들어오면 expo-notifications로 FCM 토큰을 받아
// POST /push/tokens로 등록한다. Expo Go 안드로이드는 푸시를 지원하지 않아 지금은 넣지 않는다.
export async function requestNotificationPermission() {
  try {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    } else if (Platform.OS === 'web' && typeof Notification !== 'undefined') {
      await Notification.requestPermission();
    }
  } catch {
    // 권한은 나중에 설정에서 바꿀 수 있다.
  }
}
