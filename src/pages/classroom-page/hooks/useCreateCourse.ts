import { CreatedCourse, CreateCourseInput } from '../courseTypes';
import { addDummyDetail } from '../dummy/courseDetails';
import { addDummyCourse } from '../dummy/courses';

// import { useQueryClient } from '@tanstack/react-query';
// import { useCreate } from '@/api/3-과목/3-과목';

let dummyCourseId = 100;

// POST /courses
export function useCreateCourse() {
  // API 연동 시 아래 return으로 교체. 퀴즈 출처는 기본값으로 고정한다.
  // const queryClient = useQueryClient();
  // const { mutate, isPending } = useCreate();
  // return {
  //   createCourse: (input: CreateCourseInput, onSuccess: (course: CreatedCourse) => void) =>
  //     mutate(
  //       { data: { ...input, quizSource: { type: 'default' } } },
  //       {
  //         onSuccess: (course) => {
  //           queryClient.invalidateQueries();
  //           onSuccess(course as CreatedCourse);
  //         },
  //       },
  //     ),
  //   isPending,
  // };

  return {
    createCourse: (input: CreateCourseInput, onSuccess: (course: CreatedCourse) => void) => {
      dummyCourseId += 1;
      const courseId = dummyCourseId;
      addDummyCourse({ courseId, name: input.name, icon: input.icon, intro: input.intro });
      addDummyDetail({
        courseId,
        name: input.name,
        icon: input.icon,
        intro: input.intro,
        term: input.term,
        subscribers: 1,
        role: 'admin',
        rawAllowed: true,
        archiveCount: 0,
        state: 'active',
      });
      onSuccess({ id: courseId, code: 'DB7K2Q' });
    },
    isPending: false,
  };
}
