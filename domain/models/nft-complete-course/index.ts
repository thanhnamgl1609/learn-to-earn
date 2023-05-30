import {
  KnowledgeBlockEntity,
  NftCompleteCourseEntity,
} from '@_types/models/entities';
import { dateVO } from '../value-objects';

export const displayGrantDate = ({ grantDate }: NftCompleteCourseEntity) =>
  dateVO.displaySlashDate(grantDate);

export const groupListByKnowledgeId = (
  nftCompleteCourses: NftCompleteCourseEntity[],
  knowledgeBlocks: KnowledgeBlockEntity[]
) => {
  const knowledgeBlocksById = knowledgeBlocks.reduce(
    (prev, knowledgeBlock) => ({
      ...prev,
      [knowledgeBlock.id]: knowledgeBlock,
    }),
    {}
  );
  return nftCompleteCourses.reduce(() => {}, knowledgeBlocksById);
};
