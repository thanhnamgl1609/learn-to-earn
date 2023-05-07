import moment, { Moment } from 'moment';

export const after = (d: Date | Moment, t: Date | Moment = new Date()) => {
  return moment(d).isAfter(moment(t));
};

export const sameOrAfter = (d: Date | Moment, t: Date | Moment = moment()) => {
  return moment(d).isSameOrAfter(moment(t));
};

export const before = (d: Date | Moment, t: Date | Moment = new Date()) => {
  return moment(d).isBefore(moment(t));
};

export const sameOrBefore = (d: Date | Moment, t: Date | Moment = moment()) => {
  return moment(d).isSameOrBefore(moment(t));
};

export const between = (
  start: Date | Moment,
  end: Date | Moment,
  t: Date | Moment = moment()
) => {
  return moment(t).isBetween(start, end);
};

export const formatDate = (d?: Date | Moment | null, format = 'DD/MM/YYYY') => {
  return d ? moment(d).format(format) : '';
};
