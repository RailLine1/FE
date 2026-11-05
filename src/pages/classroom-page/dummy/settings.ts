import { CourseRole, CourseSettings, UpdateCourseInput } from '../courseTypes';
import { dummyDetailStore, updateDummyDetail } from './courseDetails';
import { updateDummyCourse } from './courses';

// API 연동 후 이 폴더는 삭제한다.
const codes: Record<number, string> = {
  1: 'OS4X9P',
  2: 'NW3T8R',
  3: 'DB7K2Q',
  4: 'AG4S7T',
  5: 'DS77KQ',
};

const memberFields = (role: CourseRole, code: string, notify: boolean): CourseSettings => ({
  code,
  role,
  notify,
  icon: null,
  intro: null,
  visibility: null,
  midExamDate: null,
  finalExamDate: null,
  rawAllowed: null,
});

type StoredSettings = Pick<
  CourseSettings,
  'notify' | 'visibility' | 'midExamDate' | 'finalExamDate'
>;

let stored: Record<number, StoredSettings> = {
  3: {
    notify: true,
    visibility: 'private',
    midExamDate: '2026-10-22',
    finalExamDate: '2026-12-17',
  },
};

const storedOf = (courseId: number): StoredSettings =>
  stored[courseId] ?? {
    notify: true,
    visibility: 'private',
    midExamDate: null,
    finalExamDate: null,
  };

const listeners = new Set<() => void>();
const notifyAll = () => listeners.forEach((listener) => listener());

export const dummySettingsStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getStored: () => stored,
};

export function getDummySettings(
  current: Record<number, StoredSettings>,
  courseId: number,
): CourseSettings | undefined {
  const detail = dummyDetailStore.getDetails().find((course) => course.courseId === courseId);
  if (!detail) return undefined;

  const values = current[courseId] ?? storedOf(courseId);
  const code = codes[courseId] ?? `CR${courseId}XY`.slice(0, 6);
  if (detail.role === 'member') return memberFields(detail.role, code, values.notify);

  return {
    ...memberFields(detail.role, code, values.notify),
    icon: detail.icon,
    intro: detail.intro,
    visibility: values.visibility,
    midExamDate: values.midExamDate,
    finalExamDate: values.finalExamDate,
    rawAllowed: detail.rawAllowed,
  };
}

export function updateDummySettings(courseId: number, input: UpdateCourseInput) {
  const { visibility, midExamDate, finalExamDate, ...detailPatch } = input;
  updateDummyDetail(courseId, detailPatch);
  updateDummyCourse(courseId, detailPatch);
  stored = {
    ...stored,
    [courseId]: {
      ...storedOf(courseId),
      ...(visibility !== undefined && { visibility }),
      ...(midExamDate !== undefined && { midExamDate }),
      ...(finalExamDate !== undefined && { finalExamDate }),
    },
  };
  notifyAll();
}

export function updateDummyNotify(courseId: number, notify: boolean) {
  stored = { ...stored, [courseId]: { ...storedOf(courseId), notify } };
  notifyAll();
}
