export type CourseMeta = {
  name: string;
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
  course: {
    id: number;
    name: string;
  };
  teacher: {
    tokenId: number;
    name: string;
  };
};
export type ClassCore = {
  id: number;
  knowledgeBlockId: number;
  prevCourseId: number;
  teacherTokenId: number;
  credits: number;
  courseId: number;
  completeAt: Date | null;
  maxSize: number;
  registeredStartAt: Date | null;
  registeredEndAt: Date | null;
  numberOfStudents?: number;
};
export type Class = {
  meta: ClassMeta;
  isUploading?: boolean;
} & ClassCore;
