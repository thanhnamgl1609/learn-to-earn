import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-iron-session';

import { IHandler } from '@_types/api';
import REQUEST_CONST from 'config/request.json';
import { coursesRepo } from 'domain/repositories';
import { pinataService } from 'domain/services';
import { run, withSession } from '@api/utils';
import { contract } from '@api/utils/load-contract'
import { addressCheck, isOwner } from '@api/middleware';
import { formatCourses } from '@hooks/formatter';

const { METHOD } = REQUEST_CONST;

const post: IHandler = async (req, res) => {
  const allContractCourseResponses = await contract.nftSchool.getCourseById();
  const allContractCourses = await formatCourses(allContractCourseResponses);
  const allNotSyncCourses = await coursesRepo.getNotSyncCourse(allContractCourses);
  let syncResults = [];

  if (allNotSyncCourses.length) {
     syncResults = await Promise.allSettled(
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
            } catch {
              throw courseCode;
            }
        })
    );
    
    
  }

  res.sendData(200, syncResults);
};

export default withSession(
  run({
    [METHOD.POST]: [addressCheck, isOwner, post],
  })
);
