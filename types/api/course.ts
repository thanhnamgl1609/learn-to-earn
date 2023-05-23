import { CourseMeta, CourseCore } from '@_types/school';

export type CourseQuery = {
  knowledgeBlockId?: number | string;
  courseCode?: string;
  onChainId?: number;
};

export type CourseDetailQuery = {
  id?: number;
};

export type CourseApi = CourseMeta &
  CourseCore & {
    onChainId: number;
    chainURI: string;
  };
