import { request } from 'utils';

import Api from 'config/api.json';
import { CourseResponse } from '@_types/contracts/NftSchool';
import { Course } from '@_types/school';

export const formatCourse = async ({
  id,
  prevCourseId,
  knowledgeBlockId,
  credits,
  status,
  uri,
}: CourseResponse): Promise<Course> => {
  const coreCourse = {
    id: id.toNumber(),
    prevCourseId: prevCourseId.toNumber(),
    knowledgeBlockId: knowledgeBlockId.toNumber(),
    credits: credits.toNumber(),
    status: status.toNumber(),
  };
  try {
    const { data: meta } = await request.get(Api.proxy, {
      params: {
        l: uri,
      },
    });

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
