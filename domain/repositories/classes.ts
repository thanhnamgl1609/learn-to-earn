import db from '../../models';

export const getAll = () => {
  console.log(Object.keys(db));
  return db.classes.findAll();
};
