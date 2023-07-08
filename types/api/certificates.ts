import {
  KnowledgeBlockEntity,
  NftCompleteCourseEntity,
} from '@_types/models/entities';

// export type ExchangeNftCompleteCourseParams = {
//   studentTokenId: number;
//   avgScore: number;
//   classId: number;
//   tokenURI: string;
// };

export type GrantNftCompleteCourseParams = {
  studentTokenId: number;
  avgScore: number;
  classId: number;
  tokenURI: string;
};

export type ExchangeNftCompleteCourseBodyData = {
  nftClassRegistrationTokenId: number;
  tokenId: number;
  studentTokenId: number;
  tokenURI: string;
  grantDate: Date;
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
  nftCompleteCourseTokenIds?: number[];
};

export type NftCompleteCourseListResponse = {
  list: NftCompleteCourseEntity[];
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

export type NftGraduationQuery = {
  id?: number;
  studentTokenId?: number;
  tokenId?: number;
};

export type CreatedNftGraduation = {
  tokenId: number;
  studentTokenId: number;
  grantDate: Date;
  nftCompleteCourseTokenIds: number[];
  uri: string;
};

export type CreatedRequestGraduation = {
  studentTokenId: number;
  nftCompleteCourseTokenIds: number[];
  uri: string;
  nationalDefenseEduCertificate?: string;
  foreignLanguageCertificate?: string;
  requestPrice?: string;
  otherCertificates?: string[];
};

export type RequestGraduationQuery = {
  id?: number;
  studentTokenId?: number;
};

export type RequestGraduationListQuery = {};

export type UpdateScoreForNftClassRegistrationBodyData = {
  score: number;
  tokenId: number;
  teacherTokenId: number;
};
