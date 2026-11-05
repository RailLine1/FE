import { CourseFile, CourseFolder } from '../courseTypes';

// API 연동 후 이 폴더는 삭제한다.
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const file = (
  fileId: number,
  title: string,
  pages: number | null,
  days: number,
  status: CourseFile['status'] = 'ready',
): CourseFile => ({ fileId, title, pages, status, uploadedAt: daysAgo(days) });

type DummyFolder = Omit<CourseFolder, 'fileCount'>;

export type MaterialState = {
  folders: Record<number, DummyFolder[]>;
  files: Record<number, CourseFile[]>;
};

let state: MaterialState = {
  folders: {
    1: [
      { folderId: 101, name: 'final', kind: 'final' },
      { folderId: 102, name: 'mid', kind: 'mid' },
      { folderId: 103, name: '참고자료', kind: 'custom' },
    ],
    3: [
      { folderId: 301, name: 'final', kind: 'final' },
      { folderId: 302, name: 'mid', kind: 'mid' },
      { folderId: 303, name: '기출 정리', kind: 'custom' },
    ],
  },
  files: {
    101: [
      file(1, 'lec07 페이지 교체 알고리즘', 34, 1),
      file(2, 'lec06 동기화와 세마포어', 28, 8),
      file(3, 'lec05 가상 메모리 (1)', 31, 15),
    ],
    102: [
      file(4, 'lec04 CPU 스케줄링', 26, 30),
      file(5, 'lec03 프로세스', 22, 37),
      file(6, 'lec02 시스템 콜', 18, 44),
      file(7, 'lec01 운영체제 개요', 15, 51),
    ],
    103: [file(8, '기출 2024 중간', 6, 20), file(9, '기출 2025 중간', 7, 21)],
    301: [
      file(10, 'ch08 트랜잭션', null, 0, 'processing'),
      file(11, 'ch07 정규화', 29, 7),
      file(12, 'ch06 SQL 심화', 35, 14),
      file(13, 'ch05 ER 모델', 24, 21),
    ],
    302: [file(14, 'ch04 관계 대수', 21, 40), file(15, 'ch03 SQL 기초', 33, 47)],
    303: [file(16, '기출 2025 기말', 8, 25), file(17, '기출 2024 기말', 8, 26)],
  },
};

let nextId = 1000;
const listeners = new Set<() => void>();

const setState = (next: Partial<MaterialState>) => {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
};

const foldersOf = ({ folders }: MaterialState, courseId: number): DummyFolder[] =>
  folders[courseId] ?? [
    { folderId: courseId * 100 + 1, name: 'final', kind: 'final' },
    { folderId: courseId * 100 + 2, name: 'mid', kind: 'mid' },
  ];

export const dummyMaterialStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getState: () => state,
};

export function getDummyFolders(current: MaterialState, courseId: number): CourseFolder[] {
  return foldersOf(current, courseId).map((folder) => ({
    ...folder,
    fileCount: current.files[folder.folderId]?.length ?? 0,
  }));
}

export function getDummyFiles(current: MaterialState, folderId: number): CourseFile[] {
  return current.files[folderId] ?? [];
}

const setFolders = (courseId: number, folders: DummyFolder[]) =>
  setState({ folders: { ...state.folders, [courseId]: folders } });

export function createDummyFolder(courseId: number, name: string) {
  nextId += 1;
  setFolders(courseId, [...foldersOf(state, courseId), { folderId: nextId, name, kind: 'custom' }]);
}

export function renameDummyFolder(courseId: number, folderId: number, name: string) {
  setFolders(
    courseId,
    foldersOf(state, courseId).map((folder) =>
      folder.folderId === folderId ? { ...folder, name } : folder,
    ),
  );
}

export function deleteDummyFolder(courseId: number, folderId: number) {
  setFolders(
    courseId,
    foldersOf(state, courseId).filter((folder) => folder.folderId !== folderId),
  );
}

export function deleteDummyFile(folderId: number, fileId: number) {
  setState({
    files: {
      ...state.files,
      [folderId]: getDummyFiles(state, folderId).filter((item) => item.fileId !== fileId),
    },
  });
}

export function uploadDummyFile(folderId: number, title: string) {
  nextId += 1;
  setState({
    files: {
      ...state.files,
      [folderId]: [file(nextId, title, null, 0, 'processing'), ...getDummyFiles(state, folderId)],
    },
  });
}
