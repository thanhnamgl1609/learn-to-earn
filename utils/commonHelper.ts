export const findById = <D>(list: D[], sid: number | string, key = 'id') =>
  list.find((item) => sid === item[key]);

export const floor = (val: number, numberOfDigits: number = 0) =>
  Math.floor(val * 10 ** numberOfDigits) / 10 ** numberOfDigits;
