export type UserEntity = {
  id: number;
  profileImage: string;
  tokenId: number;
  fullName: string;
  memberCode: string;
  gender: number;
  dateOfBirth: Date;
  email: string;
  personalEmail: string;
  identityNumber: string;
  phone: string;
  role: number;
  status: number;
  registerAddress: string;
  registerDate: Date;
  approveDate: Date;
  expiredAt: Date;
  chainURI: string;

  documentURIs?: string[];
  nftGraduation: NftGraduationEntity;
};

export type CourseEntity = {
  id: number;
  knowledgeBlockId: number;
  onChainId: number | null;
  courseCode: string;
  prevCourseId: number | null;
  name: string;
  credits: number;
  status: number;
  description: string;
  isRequired: boolean;
  theoryLessons: number;
  practiceLessons: number;
  exerciseLessons: number;
  chainURI: string | null;

  prevCourse?: CourseEntity;
  knowledgeBlock?: KnowledgeBlockEntity;
};

export type ClassEntity = {
  id: number;
  onChainId: number;
  courseCode: string;
  knowledgeBlockId: number;
  credits: number;
  startAt: Date;
  completeAt: Date;
  maxSize: number;
  teacherTokenId: number;
  chainURI: string;
  semesterId: number;

  numberOfStudents?: number;
  registerClassFee?: number;
  course?: CourseEntity;
  teacher?: UserEntity;
  knowledgeBlock?: KnowledgeBlockEntity;
  nftCompleteCourses?: NftCompleteCourseEntity[];
};

export type SemesterEntity = {
  id: number;
  startYear: number;
  endYear: number;
  semester: number;
  startAt: Date;
  endAt: Date;

  isCurrent?: boolean;
  isPast?: boolean;
  registerStartAt?: Date;
  registerEndAt?: Date;
  isInRegisterTime?: boolean;
};

export type NftClassRegistrationEntity = {
  id: number;
  tokenId: number;
  classId: number;
  studentTokenId: number;
  chainURI: string;
  registerDate: Date;
  registerFee: number;

  class?: ClassEntity;
  student?: UserEntity;
};

export type NftCompleteCourseEntity = {
  id: number;
  tokenId: number;
  studentTokenId: number;
  classId: number;
  avgScore: number;
  chainURI: string;
  grantDate: Date;

  class?: ClassEntity;
  student?: UserEntity;
};

export type KnowledgeBlockEntity = {
  id: number;
  name: string;
  onChainId: number;
  credits: number;

  classes: ClassEntity[];
};

export type NftCompleteCourseGraduationRelation = {
  requestGraduationId: number;
  nftGraduationTokenId: number;
  nftCompleteCourseTokenId: number;

  nftCompleteCourse?: NftCompleteCourseEntity;
};

export type RequestGraduationEntity = {
  id?: number;
  studentTokenId: number;
  uri: string;
  nftCompleteCourseTokenIds: number[];
  requestPrice: string;
  nationalDefenseEduCertificate: string;
  foreignLanguageCertificate: string;
  otherCertificates: string[];
  student?: UserEntity;

  nftCompleteCourses?: NftCompleteCourseEntity[];
  nftCompleteCourseGraduationRelations?: NftCompleteCourseGraduationRelation[];
};

export type NftGraduationEntity = {
  id: number;
  tokenId: number;
  studentTokenId: number;
  nftCompleteCourseIds: number[];
  grantDate: Date;
  uri: string;

  nftCompleteCourses: NftCompleteCourseEntity[];
  nftCompleteCourseGraduationRelations?: NftCompleteCourseGraduationRelation[];
  request?: RequestGraduationEntity;
};
