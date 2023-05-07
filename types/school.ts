export type CourseMeta = {
  name: string;
};
export type CourseCore = {
  id: number;
  knowledgeBlockId: number; // cannot be updated
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
