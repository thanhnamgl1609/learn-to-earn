import db from '../../models';

export const getAll = () => {
  return db.courses.findAll();
};
