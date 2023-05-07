import { parseBigNumber, parseBigNumberFields, parseDate, request } from 'utils';

import Api from 'config/api.json';
import { ClassresponseResponse } from '@_types/contracts/NftSchool';
import { Class } from '@_types/school';

const defaultMeta = {
  course: {
    id: 0,
    name: '',
  },
  teacher: {
    tokenId: 0,
    name: '',
  },
};

export const formatClassResponse = async ({
  '0': classResponse,
  '1': numberOfStudents,
}: ClassresponseResponse): Promise<Class> => {
  const {
    id,
    courseId,
    knowledgeBlockId,
    prevCourseId,
    credits,
    registeredStartAt,
    registeredEndAt,
    completeAt,
    maxSize,
    teacherTokenId,
    uri,
  } = parseBigNumberFields(classResponse, [
    'id',
    'courseId',
    'knowledgeBlockId',
    'prevCourseId',
    'credits',
    'registeredStartAt',
    'registeredEndAt',
    'completeAt',
    'maxSize',
    'teacherTokenId',
  ]);

  const coreClass = {
    id,
    courseId,
    knowledgeBlockId,
    prevCourseId,
    credits,
    registeredStartAt: parseDate(registeredStartAt),
    registeredEndAt: parseDate(registeredEndAt),
    completeAt: parseDate(completeAt),
    maxSize,
    teacherTokenId,
    numberOfStudents: parseBigNumber(numberOfStudents),
  };
  try {
    const { data: meta } = await request.get(Api.proxy, {
      params: {
        l: uri,
      },
    });

    return {
      ...coreClass,
      meta,
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
  raws: ClassresponseResponse[]
): Promise<Class[]> => Promise.all(raws.map((raw) => formatClassResponse(raw)));
