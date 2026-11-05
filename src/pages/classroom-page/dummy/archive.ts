import { ArchivePage, ArchivePost, Memo } from '../courseTypes';

// API 연동 후 이 폴더는 삭제한다.
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

type DummyPost = Omit<ArchivePost, 'memoCount'>;

const posts: DummyPost[] = [
  {
    bitId: 41,
    no: 41,
    archivedAt: daysAgo(0),
    stem: '세마포어 값이 0 이하일 때 P 연산을 하면?',
    choices: [
      '프로세스가 즉시 종료된다',
      '대기 큐에 들어가 블록된다',
      '세마포어 값이 초기화된다',
      '다른 프로세스가 강제로 깨어난다',
    ],
    answer: 1,
    explanation:
      'P 연산은 값을 감소시키고, 쓸 수 있는 자원이 없으면 호출한 프로세스를 대기 큐에 넣어 블록시켜요.',
    evidence: { fileId: 2, file: 'lec06', page: 8 },
    stats: { attempts: 31, accuracy: 72, averageSec: 48 },
  },
  {
    bitId: 40,
    no: 40,
    archivedAt: daysAgo(1),
    stem: '교착 상태의 필요 조건이 아닌 것은?',
    choices: ['상호 배제', '점유와 대기', '선점 가능', '순환 대기'],
    answer: 2,
    explanation: '교착 상태의 필요 조건은 비선점이에요. 선점이 가능하면 교착 상태가 풀릴 수 있어요.',
    evidence: { fileId: 2, file: 'lec06', page: 15 },
    stats: { attempts: 29, accuracy: 64, averageSec: 62 },
  },
  ...Array.from({ length: 10 }, (_, index) => ({
    bitId: 39 - index,
    no: 39 - index,
    archivedAt: daysAgo(index + 2),
    stem: `페이지 교체 알고리즘 복습 문제 ${39 - index}번이에요. 가장 알맞은 것은?`,
    choices: ['FIFO', 'LRU', 'OPT', 'LFU'],
    answer: 1,
    explanation: 'LRU는 가장 오랫동안 사용되지 않은 페이지를 교체해요.',
    evidence: { fileId: 1, file: 'lec07', page: 12 },
    stats: { attempts: 25, accuracy: 70, averageSec: 55 },
  })),
];

let memos: Record<number, Memo[]> = {
  41: [
    { memoId: 1, body: '세마포어 값이 0이면 P 연산에서 블록. lec07 p.12', mine: true },
    { memoId: 2, body: '③은 뮤텍스 설명. 세마포어는 카운터가 있다는 점이 차이', mine: false },
    { memoId: 3, body: 'P(wait) → 임계 구역 → V(signal) 순서 다시 외우기', mine: false },
  ],
  40: [
    { memoId: 4, body: '비선점과 선점 가능을 헷갈리지 않기', mine: false },
    { memoId: 5, body: '네 가지 조건을 모두 만족해야 교착 상태', mine: false },
  ],
};

let nextMemoId = 100;
const listeners = new Set<() => void>();

const setMemos = (bitId: number, next: Memo[]) => {
  memos = { ...memos, [bitId]: next };
  listeners.forEach((listener) => listener());
};

// 실제 API의 캐시 갱신을 대신해 메모 변경을 목록의 메모 수에도 반영한다.
export const dummyArchiveStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getMemos: () => memos,
};

export function getDummyArchive(
  current: Record<number, Memo[]>,
  page: number,
  size: number,
): ArchivePage {
  const start = (page - 1) * size;
  return {
    items: posts
      .slice(start, start + size)
      .map((post) => ({ ...post, memoCount: current[post.bitId]?.length ?? 0 })),
    total: posts.length,
    page,
    size,
  };
}

export function addDummyMemo(bitId: number, body: string) {
  nextMemoId += 1;
  setMemos(bitId, [{ memoId: nextMemoId, body, mine: true }, ...(memos[bitId] ?? [])]);
}

export function editDummyMemo(bitId: number, memoId: number, body: string) {
  setMemos(
    bitId,
    (memos[bitId] ?? []).map((memo) => (memo.memoId === memoId ? { ...memo, body } : memo)),
  );
}

export function deleteDummyMemo(bitId: number, memoId: number) {
  setMemos(
    bitId,
    (memos[bitId] ?? []).filter((memo) => memo.memoId !== memoId),
  );
}
