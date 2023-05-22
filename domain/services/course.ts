import REQUEST_CONST from 'config/request.json';
import { coursesRepo } from 'domain/repositories';
import * as pinataService from './pinata';
import { contract } from '@api/utils/load-contract'
import { formatCourses } from '@hooks/formatter';

const { METHOD } = REQUEST_CONST;

const syncCourseToContract = async () => {
  const allContractCourseResponses = await contract.nftSchool.getAllCourses();
  const allContractCourses = await formatCourses(allContractCourseResponses);
  const allNotSyncCourses = await coursesRepo.getNotSyncCourse(allContractCourses);

  if (!allNotSyncCourses.length) {
    return [];
  }

  const result = await Promise.allSettled(
    allNotSyncCourses.map(async (course) => {
      try {  
        const {
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
          } = course;

          const meta = {
            credits,
            courseCode,
            name,
            description,
            isRequired,
            theoryLessons,
            practiceLessons,
            exerciseLessons,          
          }
          
          const uri = await pinataService.uploadData(meta);
        
          await contract.nftSchool.createCourse(
            prevCourseId,
            knowledgeBlockId,
            credits,
            uri,
          );
          const onChainId = (await contract.nftSchool.getCourseIdByURI(uri)).toNumber();
          await coursesRepo.update({
            courseCode,
            onChainId,
            chainURI: uri,
          });
          return courseCode;
        } catch {
          throw courseCode;
        }
    })
  );

  return result.reduce(({ success, error }, { status, reason, value }) => ({
    success: status === 'fulfilled' ? [...success, value] : success,
    error: status === 'rejected' ? [...error, reason] : reason,
  }), {
    success: [],
    error: [],
  })
};
