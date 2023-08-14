import {
  KnowledgeBlockEntityWithGain,
  KnowledgeBlockListResponse,
} from '@_types/api/certificates';
import { KnowledgeBlockEntity } from '@_types/models/entities';

export const createDefaultKnowledgeBlockList =
  (): KnowledgeBlockListResponse => ({
    avgScore: 0,
    totalCredits: 0,
    totalScore: 0,
    list: [] as KnowledgeBlockEntityWithGain[],
  });

export const getTotalRequiredCredits = (
  knowledgeBlocks: KnowledgeBlockEntity[]
) => knowledgeBlocks.reduce((prev, { credits }) => prev + credits, 0);

export const checkCanGraduate = (
  knowledgeBlocks: KnowledgeBlockListResponse
) => {
  const totalRequiredCredits = getTotalRequiredCredits(
    knowledgeBlocks.list as KnowledgeBlockEntity[]
  );
  const isEnoughTotalCredits =
    knowledgeBlocks.totalCredits >= totalRequiredCredits;
  const isEnoughForEach = knowledgeBlocks.list.every(
    ({ credits, totalCredits }) => totalCredits >= credits
  );

  return isEnoughTotalCredits && isEnoughForEach;
};

export const displayPublic = (
  knowledgeBlocks: KnowledgeBlockEntity
) => ({
  name: knowledgeBlocks.name,
  onChainId: knowledgeBlocks.onChainId,
  credits: knowledgeBlocks.credits,
});
