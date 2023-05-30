export type NftCompleteCourseCore = {
  tokenId: number;
  courseId: number;
  knowledgeBlockId: number;
  credits: number;
  avgScore: number;
};

export type NftCompleteCourseMetadata = {};

export type NftCompleteCourse = {
  uri: string;
  meta: NftCompleteCourseMetadata;
} & NftCompleteCourseCore;
