import { coursesRepo } from 'domain/repositories';
import * as pinataService from '../pinata';
import { contract } from '@api/utils/load-contract';
import { formatCourses } from '@hooks/web3/formatter';
import { logger } from 'utils';
import { getIpfsLink } from 'utils/pinataHelper';

export const syncCourseToContract = async () => {
  const allContractCourseResponses = await contract.nftSchool.getAllCourses();
  const allContractCourses = await formatCourses(allContractCourseResponses);
  const allNotSyncCourses = await coursesRepo.getNotSyncCourse(
    allContractCourses,
    { limit: 20 }
  );

  if (!allNotSyncCourses.length) {
    return [];
  }
  const result = {
    success: [],
    error: [],
  };

  for (const course of allNotSyncCourses) {
    const {
      id,
      prevCourseId,
      knowledgeBlockId,
      credits,
      courseCode,
      name,
      description,
      isRequired,
      theoryLessons,
      practiceLessons,
      exerciseLessons,
      chainURI,
    } = course;
    let uri = chainURI;

    try {
      const meta = {
        credits,
        courseCode,
        name,
        description,
        isRequired,
        theoryLessons,
        practiceLessons,
        exerciseLessons,
      };

      if (!uri) {
        const uploadRes = await pinataService.uploadData(meta);
        uri = getIpfsLink(uploadRes);
      }

      await contract.nftSchool.createCourse(
        prevCourseId ?? 0,
        knowledgeBlockId,
        credits,
        uri,
        {
          gasLimit: 500000,
        }
      );
      const onChainId = (
        await contract.nftSchool.getCourseIdByURI(uri)
      ).toNumber();
      await coursesRepo.update({
        id,
        courseCode,
        onChainId,
        chainURI: uri,
      });
      result.success.push(courseCode);
    } catch (e) {
      logger(e);
      result.error.push(courseCode);
    }
  }

  return result;
};