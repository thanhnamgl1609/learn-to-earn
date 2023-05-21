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
