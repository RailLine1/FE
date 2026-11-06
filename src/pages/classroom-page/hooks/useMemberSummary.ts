import { useJoinRequests, useMembers } from '@/api/5-멤버-가입-요청/5-멤버-가입-요청';

import { CourseMember, JoinRequest } from '../courseTypes';

// GET /courses/{courseId}/members, GET /courses/{courseId}/join-requests
// 권한이 🅰🅲라서 관리자 설정 화면에서만 쓴다.
export function useMemberSummary(courseId: number) {
  const { data: members } = useMembers<CourseMember[]>(courseId);
  const { data: requests } = useJoinRequests<JoinRequest[]>(courseId);

  return {
    coCount: members?.filter(({ role }) => role === 'co').length ?? 0,
    memberCount: members?.filter(({ role }) => role === 'member').length ?? 0,
    requestCount: requests?.length ?? 0,
  };
}
