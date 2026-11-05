// API 명세 2. 과목 GET /courses/mine 기준
export type MineState = 'active' | 'ended';

export type CourseTile = {
  courseId: number;
  name: string;
  icon: string;
  intro: string | null;
};

export type CourseRole = 'admin' | 'co' | 'member';

// GET /courses/{courseId}
export type CourseDetail = CourseTile & {
  term: string | null;
  subscribers: number;
  role: CourseRole;
  rawAllowed: boolean;
  archiveCount: number;
  state: MineState;
};

// GET /courses/{courseId}/folders
export type CourseFolder = {
  folderId: number;
  name: string;
  kind: 'mid' | 'final' | 'custom';
  fileCount: number;
};

// GET /me/connector
export type ConnectorClient = {
  client: 'claude' | 'chatgpt' | 'claudecode' | 'codex';
  lastCalledAt: string | null;
};

export type MyConnector = {
  clients: ConnectorClient[];
};

// GET /courses/{courseId}/members
export type CourseMember = {
  userId: number;
  nickname: string;
  role: CourseRole;
  coSince: string | null;
};

// GET /folders/{folderId}/files
export type FileStatus = 'processing' | 'ready' | 'failed';

export type CourseFile = {
  fileId: number;
  title: string;
  status: FileStatus;
  pages: number | null;
  uploadedAt: string;
};

// GET /courses/{courseId}/archive
export type ArchivePost = {
  bitId: number;
  no: number;
  archivedAt: string;
  stem: string;
  choices: string[];
  // choices의 0부터 시작하는 번호
  answer: number;
  explanation: string;
  evidence: {
    fileId: number | null;
    file: string;
    page: number;
  };
  stats: {
    attempts: number;
    accuracy: number;
    averageSec: number;
  };
  memoCount: number;
};

export type ArchivePage = {
  items: ArchivePost[];
  total: number;
  page: number;
  size: number;
};

// GET /archive/{bitId}/memos. 작성자는 내려주지 않는다(P-ARC-03).
export type Memo = {
  memoId: number;
  body: string;
  mine: boolean;
};

// POST /courses
export type CourseVisibility = 'public' | 'private';

export type CreateCourseInput = {
  name: string;
  icon: string;
  intro: string | null;
  term: string;
  visibility: CourseVisibility;
  midExamDate: string | null;
  finalExamDate: string | null;
};

export type CreatedCourse = {
  id: number;
  code: string;
};

// GET /courses/{courseId}/settings. 멤버는 code, role, notify만 온다(P-ROLE-01).
export type CourseSettings = {
  code: string;
  role: CourseRole;
  notify: boolean;
  icon: string | null;
  intro: string | null;
  visibility: CourseVisibility | null;
  midExamDate: string | null;
  finalExamDate: string | null;
  rawAllowed: boolean | null;
};

// PATCH /courses/{courseId}. 바꾼 항목만 보낸다.
export type UpdateCourseInput = {
  icon?: string;
  intro?: string | null;
  visibility?: CourseVisibility;
  midExamDate?: string | null;
  finalExamDate?: string | null;
  rawAllowed?: boolean;
};

// GET /courses/{courseId}/join-requests
export type JoinRequest = {
  requestId: number;
  nickname: string;
  requestedAt: string;
};
