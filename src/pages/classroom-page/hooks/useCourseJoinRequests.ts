import { useJoinRequests } from '@/api/5-멤버-가입-요청/5-멤버-가입-요청';

import { JoinRequest } from '../courseTypes';

// GET /courses/{courseId}/join-requests
export function useCourseJoinRequests(courseId: number, enabled: boolean) {
  return useJoinRequests<JoinRequest[]>(courseId, { query: { enabled } });
}
