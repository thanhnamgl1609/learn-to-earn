import { Transaction } from 'sequelize';
import { Course } from '@_types/school';
import db from 'models';
import { withTransaction, generateCondition } from '@api/utils';
import { CourseQuery } from '@_types/api/course';

type CreateCourseInput = Omit<Course, ''>;

export const getAll = (query?: CourseQuery, transaction?: Transaction) => {
  const condition = generateCondition(query, {
    $equal: ['knowledgeBlockId'],
  });

  return db.courses.findAll({ where: condition, transaction });
};

export const getNotSyncCourse = (allContractCourses) => {
  const onChainIds = allContractCourses.map(({ id }) => id);
  
  return db.courses.findAll({
    where: {
      onChainId: {
        [db.Op.notIn]: onChainIds,
      },
    },
  });
}

export const createCourse = (course: CreateCourseInput, t?: Transaction) =>
  withTransaction(
    (transaction) => db.courses.create(course, { transaction }),
    t
  );
