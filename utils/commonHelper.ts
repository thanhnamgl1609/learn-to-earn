export const findById = <D>(list: D[], sid: number | string, key = 'id') =>
  list.find((item) => sid === item[key]);
