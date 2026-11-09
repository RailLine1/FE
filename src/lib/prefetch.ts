import { QueryClient } from '@tanstack/react-query';

import { getGetQueryOptions } from '@/api/2-내-정보/2-내-정보';
import { getDetailQueryOptions } from '@/api/3-과목/3-과목';
import { getListQueryOptions } from '@/api/4-탐색-구독/4-탐색-구독';
import { getMembersQueryOptions } from '@/api/5-멤버-가입-요청/5-멤버-가입-요청';
import { getFoldersQueryOptions } from '@/api/6-학습자료/6-학습자료';
import { getMyStreakQueryOptions, getTodayQueryOptions } from '@/api/7-bit/7-bit';
import { getGet2QueryOptions } from '@/api/10-커넥터/10-커넥터';

// 서버 왕복이 길어서(prod 0.6초 안팎) 화면에 들어가기 전에 데이터를 미리 받아 둔다.
// 각 화면 훅과 같은 인자로 불러야 같은 캐시를 쓴다. 실패해도 화면이 다시 부르므로 오류는 무시한다.

/** 강의실이 뜨면 다른 탭(Bit · 탐색 · 내 정보)에서 쓸 데이터를 받아 둔다 */
export function prefetchTabs(client: QueryClient) {
  void client.prefetchQuery(getTodayQueryOptions());
  void client.prefetchQuery(getListQueryOptions({ sort: 'subscribers', page: 1, size: 5 }));
  void client.prefetchQuery(getListQueryOptions({ sort: 'newest', page: 1, size: 3 }));
  void client.prefetchQuery(getGetQueryOptions());
  void client.prefetchQuery(getMyStreakQueryOptions({ weeks: 15 }));
  void client.prefetchQuery(getGet2QueryOptions());
}

/** 과목 상세에 필요한 것. 과목 정보 · 폴더를 함께 받고, 관리자면 멤버 수도 받아 상세 화면의 순차 호출을 없앤다 */
export function prefetchCourse(client: QueryClient, courseId: number) {
  void client.prefetchQuery({ ...getFoldersQueryOptions(courseId), retry: false });
  void client
    .fetchQuery(getDetailQueryOptions(courseId))
    .then((course) => {
      const role = (course as { role?: string }).role;
      if (role === 'admin' || role === 'co') {
        void client.prefetchQuery({ ...getMembersQueryOptions(courseId), retry: false });
      }
    })
    .catch(() => {});
}
