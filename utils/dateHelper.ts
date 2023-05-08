import moment, { Moment, unitOfTime } from 'moment';

export const after = (d: Date | Moment, t: Date | Moment = new Date()) =>
  moment(d).isAfter(moment(t));

export const sameOrAfter = (d: Date | Moment, t: Date | Moment = moment()) =>
  moment(d).isSameOrAfter(moment(t));

export const before = (d: Date | Moment, t: Date | Moment = new Date()) =>
  moment(d).isBefore(moment(t));

export const sameOrBefore = (d: Date | Moment, t: Date | Moment = moment()) =>
  moment(d).isSameOrBefore(moment(t));

export const between = (
  start: Date | Moment,
  end: Date | Moment,
  t: Date | Moment = moment()
) => moment(t).isBetween(start, end);

export const formatDate = (d?: Date | Moment | null, format = 'DD/MM/YYYY') =>
  d ? moment(d).format(format) : '';

export const dateAdd = (
  d: Date | Moment,
  interval: number | string,
  unit: unitOfTime.DurationConstructor = 'd'
) => moment(d).add(interval, unit);
