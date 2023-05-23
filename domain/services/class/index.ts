import { classesRepo } from 'domain/repositories';
import { TIMEOUT } from 'utils';
import { contract } from '@api/utils/load-contract';
import { formatClassResponse } from '@hooks/web3/formatter';
import { createError } from '@api/utils/create-error';

export const upsertFromContract = async ({ classId }: { classId: number }) => {
  const contractClassResponse = await contract.nftSchool.getClassById(classId);
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
