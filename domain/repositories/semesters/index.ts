import { Transaction } from 'sequelize';
import moment from 'moment';

import db from 'models';
import { after, before, between, today } from 'utils';
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

export const getCurrentSemester = async (attributes?: string[]) => {
  return db.semesters.findOne({
    attributes,
    where: {
      endAt: {
        [db.Op.gte]: today(),
      },
    },
    order: [['endAt', 'asc']],
  });
};

export const getCurrentSemesters = async () => {
  const currentSemester = await getCurrentSemester(['startYear']);
  const { startYear } = currentSemester.get();

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

  const result = semesters.map((semester) =>
    _getDetailSemester(semester.get())
  );

  return result;
};
