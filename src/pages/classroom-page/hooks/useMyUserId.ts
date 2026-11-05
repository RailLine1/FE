import { DUMMY_MY_USER_ID } from '../dummy/members';

// import { useGet } from '@/api/2-내-정보/2-내-정보';

// GET /me. 멤버 목록에서 내 줄을 찾는다.
export function useMyUserId(): number | undefined {
  // API 연동 시 아래 return으로 교체
  // return useGet<{ id: number }>().data?.id;

  return DUMMY_MY_USER_ID;
}
