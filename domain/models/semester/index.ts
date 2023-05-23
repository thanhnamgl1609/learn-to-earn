import { SemesterEntity } from '@_types/models/entities';
import CONST from 'config/constants.json';
import { formatDate } from 'utils';

const { DATE_TIME } = CONST;

export const displayRegisterTime = (semester?: SemesterEntity) => {
  return {
    registerStartAt: semester
      ? formatDate(semester.registerStartAt, DATE_TIME.SLASH_DATETIME)
      : 'Chưa có',
    registerEndAt: semester
      ? formatDate(semester.registerEndAt, DATE_TIME.SLASH_DATETIME)
      : 'Chưa có',
  };
};

export const displaySemester = (semester?: SemesterEntity) =>
  semester
    ? `Học kì ${semester.semester} (${formatDate(
        semester.startAt,
        DATE_TIME.SLASH_DATE
      )} - ${formatDate(semester.endAt, DATE_TIME.SLASH_DATE)})`
    : '';
