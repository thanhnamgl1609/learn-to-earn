import { BigNumber } from 'ethers';
import moment, { Moment } from 'moment';

export const parseDate = (unix: number) => {
  return moment.unix(unix).toDate();
};

export const parseTimeStamp = (
  date: Date | Moment,
  options = {
    startOf: null,
    endOf: null,
  }
) => {
  const { startOf, endOf } = options;
  let dateInMoment: Moment;

  if (startOf) dateInMoment = moment(date).startOf(startOf);
  else if (endOf) dateInMoment = moment(date).startOf(endOf);
  else dateInMoment = moment(date);

  return dateInMoment.unix();
};

export const parseBigNumber = (raw: BigNumber) => raw.toNumber();

export const parseBigNumberFields = <D>(
  raw: D,
  fields: (string | number)[]
): MergeKeys<D, typeof fields, number> =>
  fields.reduce(
    (prev, currentField) => ({
      ...prev,
      [currentField]: raw[currentField].toNumber(),
    }),
    raw
  ) as MergeKeys<D, typeof fields, number>;
