import { Transaction } from 'sequelize';
import moment from 'moment';

import db from 'models';
import { after, before, between } from 'utils';
import { CourseQuery } from '@_types/api/course';
import { generateCondition } from '@api/utils';
import { Semester, SemesterQuery } from '@_types/api/semester';

const _getDetailSemester = (semester: Semester) => {
  const now = moment();
  const isCurrent = between(semester.startAt, semester.endAt, now);
  const isPast = before(semester.endAt, now);

  return {
    ...semester,
    isCurrent,
    isPast,
  };
};

export const getCurrentSemesters = async () => {
  const startYear = (await db.semesters.max('startYear')) as number;

  return getAll({
    startYear,
  });
};

export const getAll = async (
  query?: SemesterQuery,
  transaction?: Transaction
) => {
  const condition = generateCondition(query, {
    $equal: ['startYear'],
  });

  const semesters = await db.semesters.findAll({
    where: condition,
    transaction,
    order: [['semester', 'asc']],
  });

  const result = semesters.map((semester) => _getDetailSemester(semester.get()));

  if (result.every(({ isCurrent, isPast }) => !isCurrent || !isPast)) {
    result[0].isCurrent = true;
  }

  return result;
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
    ],
    transaction,
  });
};
