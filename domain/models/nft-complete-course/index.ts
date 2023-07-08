import { NftCompleteCourseEntity } from '@_types/models/entities';
import CONST from 'config/constants.json';
import { classEntity, userEntity } from '..';
import { dateVO } from '../value-objects';

export const displayGrantDate = ({ grantDate }: NftCompleteCourseEntity) =>
  dateVO.displaySlashDate(grantDate);

export const displayStatus = (status: number) =>
  CONST.NFT_COMPLETE_COURSE_STATUS_LABELS[status];

export const displayPublic = ({
  tokenId,
  studentTokenId,
  classId,
  avgScore,
  class: classInfo,
  chainURI,
  student,
  grantDate,
}: NftCompleteCourseEntity) => ({
  tokenId,
  studentTokenId,
  classId,
  avgScore,
  chainURI,
  grantDate,
  student: userEntity.displayPublic(student),
  class: classEntity.displayPublic(classInfo),
  teacher: userEntity.displayPublic(classInfo.teacher),
});

export const displayPublicList = (
  nftCompleteCourses: NftCompleteCourseEntity[]
) => nftCompleteCourses.map(displayPublic);

// export const groupListByKnowledgeId = (
//   nftCompleteCourses: NftCompleteCourseEntity[],
//   knowledgeBlocks: KnowledgeBlockEntity[]
// ) => {
//   const knowledgeBlocksById = knowledgeBlocks.reduce(
//     (prev, knowledgeBlock) => ({
//       ...prev,
//       [knowledgeBlock.id]: knowledgeBlock,
//     }),
//     {}
//   );
//   return nftCompleteCourses.reduce(() => {}, knowledgeBlocksById);
// };
