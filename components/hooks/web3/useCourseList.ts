import useSWR from 'swr';

import { CryptoHookFactory } from '@_types/hooks';
import { Course } from '@_types/school';
import { formatCourses } from './formatter';
import { useApi } from '@hooks/common';

type UseCourseListResponse = {};

type CourseListHookFactory = CryptoHookFactory<Course[], UseCourseListResponse>;

export type UseCourseListHook = ReturnType<CourseListHookFactory>;

export const hookFactory: CourseListHookFactory =
  ({ contracts }) =>
  () => {
    const getAllCourseCaller = useApi(async () => {
      const courses = await contracts!.school.getAllCourses();
      const result = await formatCourses(courses);
      const allCourseById = result.reduce(
        (prev, course) => ({ ...prev, [course.id]: course }),
        {}
      );

      return result.map((course) => ({
        ...course,
        prevCourse: allCourseById?.[course.prevCourseId],
      }));
    });

    const { data, ...swr } = useSWR(
      contracts ? `web3/useCourseList` : null,
      getAllCourseCaller,
      {
        revalidateOnFocus: false,
      }
    );

    return {
      ...swr,
      data,
    };
  };
