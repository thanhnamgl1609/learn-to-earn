import {
  CreatedNftCompleteCourse,
  NftCompleteCourseQuery,
} from '@_types/api/certificates';
import ERROR_MESSAGE from 'config/error-message.json';
import { withTransaction } from '@api/utils';
import { createError } from '@api/utils/create-error';
import { certificatesRepo, classesRepo } from 'domain/repositories';

export const grantNftCompleteCourse = (
  data: CreatedNftCompleteCourse,
  teacherTokenId: number
) =>
  withTransaction(async (transaction) => {
    const { classId, studentTokenId } = data;
    const classInfo = await classesRepo.get({ onChainId: classId });
    // if (classInfo.teacherTokenId !== teacherTokenId)
    //   throw createError(400, ERROR_MESSAGE.NOT_TEACHER);

    const result = await certificatesRepo.createNftCompleteCourse(
      data,
      transaction
    );
    await classesRepo.updateRegainedClass(classId, studentTokenId, transaction);

    return result;
  });

export const getAll = async (query: NftCompleteCourseQuery) =>
  certificatesRepo.getAll(query);
