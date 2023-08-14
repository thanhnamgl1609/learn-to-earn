import { NftClassRegistrationEntity } from './models/entities';

export type NftCompleteCourseCore = {
  tokenId: number;
  courseId: number;
  knowledgeBlockId: number;
  credits: number;
  avgScore: number;
};

export type NftCompleteCourse = {
  uri: string;
  meta: NftCompleteCourseMetadata;
} & NftCompleteCourseCore;

export type AllowRequestNftCompleteCourseParams = {
  tokenId: number;
  isAllowed: boolean;
};

export type AllowRequestNftCompleteCoursesParams = {
  tokenId: number;
  isAllowed: boolean;
}[];

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
};

export type ExchangeNftGraduationParams = {
  tokenIds: number[];
  tokenURI: string;
};

export type SetExchangableNftGraduationParams = {
  studentTokenId: number;
  isAllowed: boolean;
};

export type RequestGraduationCertificateParams = {
  nftCompleteCourseTokenIds: number[];
  requestPrice: string;
  uri: string;
};

export type RegainNftCompleteCoursesParams = {
  studentTokenId: number;
};

export type NftCompleteCourseMetadata = {
  classInfo: ClassMetadata;
  course?: NftCompleteCourseMetadataCourse;
  teacher: UserMetadata;
  student: UserMetadata;
  score: number;
  grantDate: string;
};

export type ClassMetadata = {
  onChainId: number;
  knowledgeBlockId: number;
  teacherTokenId: number;
  credits: number;
  semesterId: number;
  startAt: string;
  completeAt: string;
  maxSize: number;
  chainURI: string;
  knowledgeBlock: KnowledgeBlockMetadata;
  course?: CourseMetadata
};

export type CourseMetadata = {
  knowledgeBlockId: number;
  onChainId: number;
  courseCode: string;
  prevCourse: string;
  name: string;
  credits: number;
  description: any;
  isRequired: string;
  theoryLessons: number;
  practiceLessons: number;
  exerciseLessons: number;
  chainURI: string;
};

export type KnowledgeBlockMetadata = {
  name: string;
  onChainId?: number;
  credits: number;
};

export type NftCompleteCourseMetadataCourse = {
  knowledgeBlockId: number;
  onChainId: number;
  courseCode: string;
  prevCourse: string;
  name: string;
  credits: number;
  description: any;
  isRequired: string;
  theoryLessons: number;
  practiceLessons: number;
  exerciseLessons: number;
  chainURI: string;
};

export type UserMetadata = {
  profileImage: string;
  tokenId: number;
  fullName: string;
  memberCode: string;
  gender: string;
  dateOfBirth: string;
  email: any;
  personalEmail: string;
  phone: string;
  expiredAt: string;
  chainURI: string;
  registerDate: string;
  approveDate: string;
  identityNumber: string;
};

export type NftGraduationMetadata = {
  nftCompleteCourses: NftGraduationNftCompleteCourse[];
  student: UserMetadata;
  nationalDefenseEduCertificate: string;
  foreignLanguageCertificate: string;
  otherCertificates: any[];
  grantDate: string;
};

export type NftGraduationNftCompleteCourse = {
  tokenId: number;
  studentTokenId: number;
  classId: number;
  avgScore: number;
  chainURI: string;
  grantDate: string;
  student: UserMetadata;
  class: ClassMetadata;
  teacher: UserMetadata;
};
