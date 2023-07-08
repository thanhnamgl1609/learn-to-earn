import useSWR from 'swr';

import { CryptoHookFactory } from '@_types/hooks';
import { Course } from '@_types/school';
import { formatCourse } from './formatter';
import { useApi } from '@hooks/common';

type UseCourseDetailResponse = {};

type CourseDetailHookFactory = CryptoHookFactory<
  Course,
  UseCourseDetailResponse,
  UseCourseDetailParams
>;

export type UseCourseDetailParams = {
  id: number;
};

export type UseCourseDetailHook = ReturnType<CourseDetailHookFactory>;

export const hookFactory: CourseDetailHookFactory =
  ({ contracts }) =>
  ({ id }) => {
    const getCourseDetail = useApi(async () => {
      const course = await contracts!.school.getCourseById(id);
      const result = await formatCourse(course);
      if (result.prevCourseId) {
        const prevCourse = await contracts!.school.getCourseById(
          result.prevCourseId
        );
        result.prevCourse = await formatCourse(prevCourse);
      }

      return result;
    });

    const { data, ...swr } = useSWR(
      contracts ? `web3/useCourseDetail${id}` : null,
      getCourseDetail,
      {
        revalidateOnFocus: false,
      }
    );

    return {
      ...swr,
      data,
    };
  };
