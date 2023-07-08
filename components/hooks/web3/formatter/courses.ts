import { request, TIMEOUT } from 'utils';

import Api from 'config/api.json';
import { CourseResponse } from '@_types/contracts/School';
import { Course } from '@_types/school';

export const formatCourse = async (
  { id, prevCourseId, knowledgeBlockId, credits, status, uri }: CourseResponse,
  {
    useProxy = true,
    timeout = TIMEOUT,
  }: {
    useProxy: boolean;
    timeout?: number;
  } = {
    useProxy: true,
    timeout: TIMEOUT,
  }
): Promise<Course> => {
  const coreCourse = {
    id: id.toNumber(),
    prevCourseId: prevCourseId.toNumber(),
    knowledgeBlockId: knowledgeBlockId.toNumber(),
    credits: credits.toNumber(),
    status: status.toNumber(),
  };
  try {
    const { data: meta } = useProxy
      ? await request.get(Api.proxy, {
          params: {
            l: uri,
            timeout,
          },
        })
      : await request.get(uri);

    return {
      ...coreCourse,
      meta,
    };
  } catch (e) {
    return {
      ...coreCourse,
      meta: {
        name: 'ERROR',
      },
      isUploading: true,
    };
  }
};

export const formatCourses = async (
  raws: CourseResponse[]
): Promise<Course[]> => Promise.all(raws.map((raw) => formatCourse(raw)));
