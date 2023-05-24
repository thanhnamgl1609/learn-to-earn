import { CourseEntity } from '@_types/models/entities';

export const displayPublic = (course: CourseEntity) => ({
  knowledgeBlockId: course.knowledgeBlockId,
  onChainId: course.onChainId,
  courseCode: course.courseCode,
  prevCourse: course.prevCourse ? displayPublic(course.prevCourse) : 'Không có',
  name: course.name,
  credits: course.credits,
  description: course.description,
  isRequired: course.isRequired ? 'Bắt buôc' : 'Tự chọn',
  theoryLessons: course.theoryLessons,
  practiceLessons: course.practiceLessons,
  exerciseLessons: course.exerciseLessons,
  chainURI: course.chainURI,
});
