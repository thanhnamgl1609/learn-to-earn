exports.getUnixTime = (date) => Math.floor(date.getTime() / 1000);

exports.dateAdd = (date, interval, unit) => {
  const result = new Date(date);

  switch (unit) {
    case 'd':
    case 'day':
    case 'days':
      result.setDate(result.getDate() + interval);
      break;
    case 'm':
    case 'month':
    case 'months':
      result.setMonth(result.getMonth() + interval);
      break;
    case 'y':
    case 'year':
    case 'years':
      result.setYear(result.getFullYear() + interval);
      break;
  }

  return result;
};
