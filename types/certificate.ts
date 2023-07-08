import { NftClassRegistrationEntity } from "./models/entities";

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

export type AllowRequestNftCompleteCourseParams = {
  tokenId: number;
  isAllowed: boolean;
}

export type UpdateScoreParams = {
  score: number;
  nftClassRegistration: NftClassRegistrationEntity;
};

export type UpdateScoreForNftClassRegistrationParams = {
  tokenId: number;
  score: number; 
};

export type ExchangeNftCompleteCourseParams = {
  nftClassRegistrationTokenId: number;
  tokenURI: string;
}

export type GrantNftGraduationParams = {
  studentTokenId: number;
  tokenURI: string;
};

export type RequestGraduationCertificateParams = {
  nftCompleteCourseTokenIds: number[];
  requestPrice: string;
  uri: string;
};

export type RegainNftCompleteCoursesParams = {
  studentTokenId: number;
};
