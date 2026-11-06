import { useMembers } from '@/api/5-멤버-가입-요청/5-멤버-가입-요청';

import { CourseMember } from '../courseTypes';

// GET /courses/{courseId}/members. 관리자, 공동 관리자(된 날짜순), 멤버 순이다(P-ROLE-02).
export function useCourseMembers(courseId: number, enabled: boolean) {
  return useMembers<CourseMember[]>(courseId, { query: { enabled } });
}
