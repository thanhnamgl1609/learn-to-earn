import {
  KnowledgeBlockEntity,
  NftCompleteCourseEntity,
} from '@_types/models/entities';

export type GrantNftCompleteCourseParams = {
  studentTokenId: number;
  avgScore: number;
  classId: number;
  tokenURI: string;
};

export type CreatedNftCompleteCourse = {
  tokenId: number;
  studentTokenId: number;
  classId: number;
  avgScore: number;
  tokenURI: string;
  grantDate: Date;
};

export type NftCompleteCourseQuery = {
  id?: number;
  tokenId?: number;
  studentTokenId?: number;
};

export type NftCompleteCourseListResponse = {
  list: NftCompleteCourseEntity[];
  totalCredits: number;
  totalAvgScore: number;
};

export type KnowledgeBlockEntityWithGain = KnowledgeBlockEntity & {
  totalCredits: number;
  totalScore: number;
  avgScore: number;
};

export type KnowledgeBlockListResponse = {
  list: KnowledgeBlockEntityWithGain[];
  avgScore: number;
  totalCredits: number;
  totalScore: number;
};
