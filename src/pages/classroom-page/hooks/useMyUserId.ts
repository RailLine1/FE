import { useGet } from '@/api/2-내-정보/2-내-정보';

// GET /me. 멤버 목록에서 내 줄을 찾는다.
export function useMyUserId(): number | undefined {
  return useGet<{ id: number }>().data?.id;
}
