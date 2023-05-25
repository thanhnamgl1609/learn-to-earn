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
  expiredAt: Date;
  chainURI: string;
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

  class?: ClassEntity;
  student?: UserEntity;
};
