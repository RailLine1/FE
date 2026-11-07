// P-NOTI-03. BE 푸시 data(type, courseId, bitId)로 알림을 눌렀을 때 갈 화면을 정한다.
// 오늘의 한 조각은 Bit 탭(시안 63, 64), 나머지는 해당 과목으로 간다.
export function notificationRoute(data: Record<string, unknown> | undefined) {
  if (data?.type === 'bit_open') return '/bit';
  if (typeof data?.courseId === 'string' && data.courseId) return `/classroom/${data.courseId}`;
  return null;
}
