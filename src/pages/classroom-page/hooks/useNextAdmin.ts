import { useMembers } from '@/api/5-멤버-가입-요청/5-멤버-가입-요청';

import { CourseMember, CourseRole } from '../courseTypes';

// GET /courses/{courseId}/members. 관리자가 탈퇴할 때 승격될 공동 관리자를 찾는다(P-ROLE-03).
export function useNextAdmin(courseId: number, role?: CourseRole) {
  const enabled = role === 'admin';
  const { data: members, isLoading } = useMembers<CourseMember[]>(courseId, { query: { enabled } });

  // 응답은 관리자, 공동 관리자(된 날짜순), 멤버 순이다(P-ROLE-02).
  const nextAdmin = members?.find((member) => member.role === 'co')?.nickname;
  return { nextAdmin, isLoading };
}
