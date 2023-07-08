import { Transaction } from 'sequelize';
import db from 'models';
import { Course, CourseCore, CourseMeta } from '@_types/school';
import { CourseApi, CourseQuery } from '@_types/api/course';
import { withTransaction, generateCondition } from '@api/utils';

type CreateCourseInput = Omit<Course, ''>;

export const getAll = (query?: CourseQuery, transaction?: Transaction) => {
  const condition = generateCondition(query, {
    $equal: ['knowledgeBlockId'],
  });

  return db.courses.findAll({
    where: {
      ...condition,
      onChainId: {
        [db.Op.not]: null,
      },
    },
    include: [
      {
        model: db.courses,
        as: 'prevCourse',
      },
      {
        model: db.knowledge_blocks,
        as: 'knowledgeBlock'
      },
    ],
    transaction,
  });
};

export const get = (query?: CourseQuery, transaction?: Transaction) => {
  const condition = generateCondition(query, {
    $equal: ['id', 'courseCode', 'onChainId'],
  });

  return db.courses.findOne({
    where: condition,
    include: [
      {
        model: db.courses,
        as: 'prevCourse',
      },
      {
        model: db.knowledge_blocks,
        as: 'knowledgeBlock',
      },
    ],
    transaction,
  });
};

export const createCourse = (course: CreateCourseInput, t?: Transaction) =>
  withTransaction(
    (transaction) => db.courses.create(course, { transaction }),
    t
  );

export const insert = async (course: CourseApi, t?: Transaction) =>
  withTransaction(async (transaction: Transaction) => {
    const {
      courseCode,
      credits,
      description,
      exerciseLessons,
      isRequired,
      knowledgeBlockId,
      name,
      onChainId,
      practiceLessons,
      prevCourseId,
      theoryLessons,
      chainURI,
    } = course;

    const _course = await db.courses.create(
      {
        courseCode,
        knowledgeBlockId,
        credits,
        description,
        exerciseLessons,
        isRequired,
        name,
        onChainId,
        practiceLessons,
        prevCourseId,
        theoryLessons,
        chainURI,
      },
      {
        transaction,
      }
    );

    return _course.get();
  }, t);

export const update = async (course: Partial<CourseApi>, t?: Transaction) =>
  withTransaction(async (transaction: Transaction) => {
    const { id, ...updatedCourse } = course;
    return db.courses.update(updatedCourse, {
      where: {
        id,
      },
      transaction,
    });
  }, t);

export const upsert = async (course: CourseApi, t?: Transaction) =>
  withTransaction(async (transaction: Transaction) => {
    const { onChainId } = course;
    const currentCourse = await get({ onChainId }, transaction);
    if (!currentCourse) {
      await insert(course, transaction);
    } else {
      await update(course, transaction);
    }

    return get({ onChainId }, transaction);
  }, t);

export const getNotSyncCourse = async (
  allContractCourses: Course[],
  { limit }: { limit?: number } = {}
): Promise<CourseApi[]> => {
  const onChainIds = allContractCourses.map(({ id }) => id);
  const conditions = onChainIds.length
    ? {
        onChainId: {
          [db.Op.or]: {
            [db.Op.notIn]: onChainIds,
            [db.Op.eq]: null,
          },
        },
      }
    : {};

  return db.courses
    .findAll({
      where: conditions,
      limit,
    })
    .then((courses) => courses.map((course) => course.get()));
};
