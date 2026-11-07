// 웹은 푸시를 받지 않는다. expo-notifications를 웹 번들에 넣지 않으려고 나눈다.
export async function registerPushToken() {}
export async function unregisterPushToken() {}
export function usePushNotifications(_ready: boolean) {}
