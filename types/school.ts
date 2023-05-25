import { StudentMeta } from './nftIdentity';

export type CourseMeta = {
  name: string;
  courseCode: string;
  status: number;
  description: string;
  isRequired: boolean;
  theoryLessons: number;
  practiceLessons: number;
  exerciseLessons: number;
};
export type CourseCore = {
  id: number;
  knowledgeBlockId: number;
  prevCourseId: number;
  credits: number;
  status: number;
};
export type Course = {
  prevCourse?: Course;
  meta: CourseMeta;
  isUploading?: boolean;
} & CourseCore;

export type RegisterTime = {
  registerStartAt: Date | null;
  registerEndAt: Date | null;
};

export type ClassMeta = {
  semesterId: number;
  startAt: Date;
  completeAt: Date;
  size: number;
  courseCode: string;
  courseName: string;
  teacherTokenId: number;
  teacherName: string;
};
export type ClassCore = {
  id: number;
  knowledgeBlockId: number;
  prevCourseId: number;
  teacherTokenId: number;
  credits: number;
  courseId: number;
  semester: number;
  completeAt: Date | null;
  maxSize: number;
  numberOfStudents?: number;
};
export type Class = {
  meta: ClassMeta;
  uri?: string;
  isUploading?: boolean;
} & ClassCore;

export type NftClassRegistrationMeta = {
  classInfo: {
    onChainId: number;
    knowledgeBlockId: number;
    teacherTokenId: number;
    credits: number;
    completeAt: Date;
    maxSize: number;
    chainURI: string;
  };
  course: {
    knowledgeBlockId: number;
    onChainId: number;
    courseCode: string;
    prevCourse: string;
    name: string;
    credits: number;
    description: string;
    isRequired: string;
    theoryLessons: string;
    practiceLessons: string;
    exerciseLessons: string;
    chainURI: string;
  };
  teacher: {
    profileImage: string;
    tokenId: number;
    fullName: string;
    memberCode: string;
    gender: string;
    dateOfBirth: string;
    email: string;
    personalEmail: string;
    phone: string;
    expiredAt: string;
    chainURI: string;
  };
  owner: {
    tokenId: number;
  } & StudentMeta;
};
export type NftClassRegistrationCore = {
  tokenId: number;
  classId: number;
  studentTokenId: number;
};

export type NftClassRegistration = {
  meta: NftClassRegistrationMeta;
  isUploading?: boolean;
} & NftClassRegistrationCore;
