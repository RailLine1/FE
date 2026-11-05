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
