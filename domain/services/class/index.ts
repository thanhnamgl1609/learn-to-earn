import { TIMEOUT } from 'utils';
import { CreatedClass } from '@_types/api/class';
import { classesRepo, semestersRepo } from 'domain/repositories';
import { contract } from '@api/utils/load-contract';
import { createError } from '@api/utils/create-error';
import { formatClassResponse } from '@hooks/web3/formatter';

export * from './register';

export const getRegisterClasses = async () => {
  const currentSemester = await semestersRepo.getCurrentSemester(['id']);
  const classes = classesRepo.getAll({
    semesterId: currentSemester.get().id,
  });

  return classes;
};

export const getAssignedClasses = async (teacherTokenId: number) => {
  const currentSemester = await semestersRepo.getCurrentSemester(['id']);
  const classes = classesRepo.getAll({
    semesterId: currentSemester.get().id,
    teacherTokenId: teacherTokenId,
  });

  return classes;
};

export const upsertFromContract = async ({ classId }: { classId: number }) => {
  const contractClassResponse = await contract.school.getClassById(classId);
  const {
    completeAt,
    credits,
    id: onChainId,
    knowledgeBlockId,
    maxSize,
    meta: { startAt, courseCode },
    semester: semesterId,
    teacherTokenId,
    uri: chainURI,
  } = await formatClassResponse(contractClassResponse, {
    useProxy: false,
    timeout: TIMEOUT / 2,
  });
  if (!courseCode) {
    throw createError(500);
  }

  return classesRepo.upsert({
    credits,
    courseCode,
    onChainId,
    knowledgeBlockId,
    maxSize,
    startAt,
    completeAt,
    semesterId,
    teacherTokenId,
    chainURI,
  });
};

export const syncClassToDB = (createdClass: CreatedClass) =>
  classesRepo.upsert(createdClass);
