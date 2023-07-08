import { formatDate } from 'utils';
import CONST from 'config/constants.json';

const {
  DATE_TIME: { DATETIME, DATE, SLASH_DATE, SLASH_DATETIME },
} = CONST;

export const displayHyphenDate = (date: Date | string) =>
  formatDate(date, DATE);

export const displayHyphenDateTime = (date: Date | string) =>
  formatDate(date, DATETIME);

export const displaySlashDate = (date: Date | string) =>
  formatDate(date, SLASH_DATE);

export const displaySlashDateTime = (date: Date | string) =>
  formatDate(date, SLASH_DATETIME);
