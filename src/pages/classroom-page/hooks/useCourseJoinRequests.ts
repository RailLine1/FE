import { useSyncExternalStore } from 'react';

import { JoinRequest } from '../courseTypes';
import { dummyMemberStore, getDummyRequests } from '../dummy/members';

// import { useJoinRequests } from '@/api/5-멤버-가입-요청/5-멤버-가입-요청';

// GET /courses/{courseId}/join-requests
export function useCourseJoinRequests(courseId: number) {
  // API 연동 시 아래 return으로 교체
  // return useJoinRequests<JoinRequest[]>(courseId);

  const state = useSyncExternalStore(
    dummyMemberStore.subscribe,
    dummyMemberStore.getRequests,
    dummyMemberStore.getRequests,
  );
  const data: JoinRequest[] = getDummyRequests(state, courseId);
  return { data, isLoading: false, isError: false };
}
