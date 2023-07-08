const moment = require('moment');

const addDays = (date, numberOfDays) =>
  moment(date).add(numberOfDays, 'd').toDate();

const addHours = (date, numberOfHours) =>
  moment(date).add(numberOfHours, 'h').toDate();

const addYears = (date, numberOfYears) =>
  moment(date).add(numberOfYears, 'y').toDate();


const parseTimestamp = (date, { endDate } = { endDate: true }) => {
  const momentObj = moment(date);
  if (endDate) return momentObj.endOf('d').unix();

  return momentObj.unix();
};

module.exports = {
  addDays,
  addHours,
  addYears,
  parseTimestamp,
};
