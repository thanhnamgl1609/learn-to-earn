import {
  parseBigNumber,
  parseBigNumberFields,
  parseDate,
  request,
  TIMEOUT,
} from 'utils';

import Api from 'config/api.json';
import { ClassResponse } from '@_types/contracts/School';
import { Class, ClassMeta } from '@_types/school';

const defaultMeta: ClassMeta = {
  semesterId: 0,
  startAt: new Date(),
  completeAt: new Date(),
  size: 0,
  courseCode: '',
  courseName: '',
  teacherTokenId: 0,
  teacherName: '',
};

export const formatClassResponse = async (
  classResponse: ClassResponse,
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
): Promise<Class> => {
  const {
    id,
    courseId,
    knowledgeBlockId,
    prevCourseId,
    credits,
    completeAt,
    maxSize,
    teacherTokenId,
    semester,
  } = parseBigNumberFields(classResponse, [
    'id',
    'courseId',
    'knowledgeBlockId',
    'prevCourseId',
    'credits',
    'completeAt',
    'maxSize',
    'semester',
    'teacherTokenId',
  ]);
  const { uri } = classResponse;

  const coreClass = {
    id,
    courseId,
    knowledgeBlockId,
    prevCourseId,
    credits,
    completeAt: parseDate(completeAt),
    maxSize,
    teacherTokenId,
    semester,
    uri,
  };
  try {
    const { data: meta } = useProxy
      ? await request.get(Api.proxy, {
          params: {
            l: uri,
          },
          timeout,
        })
      : await request.get(uri);

    return {
      ...coreClass,
      meta: {
        ...meta,
        startAt: new Date(meta.startAt),
      },
    };
  } catch (e) {
    return {
      ...coreClass,
      meta: defaultMeta,
      isUploading: true,
    };
  }
};

export const formatClassResponses = async (
  raws: ClassResponse[]
): Promise<Class[]> => Promise.all(raws.map((raw) => formatClassResponse(raw)));
