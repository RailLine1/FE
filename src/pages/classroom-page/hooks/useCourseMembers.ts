import { useSyncExternalStore } from 'react';

import { CourseMember } from '../courseTypes';
import { dummyMemberStore, getDummyMembers } from '../dummy/members';

// import { useMembers } from '@/api/5-멤버-가입-요청/5-멤버-가입-요청';

// GET /courses/{courseId}/members. 관리자, 공동 관리자(된 날짜순), 멤버 순이다(P-ROLE-02).
export function useCourseMembers(courseId: number) {
  // API 연동 시 아래 return으로 교체
  // return useMembers<CourseMember[]>(courseId);

  const state = useSyncExternalStore(
    dummyMemberStore.subscribe,
    dummyMemberStore.getMembers,
    dummyMemberStore.getMembers,
  );
  const data: CourseMember[] = getDummyMembers(state, courseId);
  return { data, isLoading: false, isError: false };
}
