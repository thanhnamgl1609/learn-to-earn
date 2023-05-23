import { Transaction } from 'sequelize';
import db from 'models';
import { Class } from '@_types/school';
import { ClassApi, ClassQuery } from '@_types/api/class';
import { withTransaction, generateCondition } from '@api/utils';

type CreateClassInput = Omit<Class, ''>;

export const getAll = (query?: ClassQuery, transaction?: Transaction) => {
  const condition = generateCondition(query, {
    $equal: ['knowledgeBlockId'],
  });

  return db.classs.findAll({
    where: {
      ...condition,
      onChainId: {
        [db.Op.not]: null,
      },
    },
    transaction,
  });
};

export const get = (query?: ClassQuery, transaction?: Transaction) => {
  const condition = generateCondition(query, {
    $equal: ['onChainId'],
  });

  return db.classes.findOne({
    where: condition,
    transaction,
  });
};

export const insert = async (_class: Partial<ClassApi>, t?: Transaction) =>
  withTransaction(async (transaction: Transaction) => {
    const createdClass = await db.classes.create(_class, {
      transaction,
    });

    return createdClass.get();
  }, t);

export const update = async (_class: Partial<ClassApi>, t?: Transaction) =>
  withTransaction(async (transaction: Transaction) => {
    const { id, ...updatedClass } = _class;

    return db.classes.update(updatedClass, {
      where: {
        id,
      },
      transaction,
    });
  }, t);

export const upsert = async (_class: Partial<ClassApi>, t?: Transaction) =>
  withTransaction(async (transaction: Transaction) => {
    const { onChainId } = _class;
    const currentClass = await get({ onChainId }, transaction);

    if (!currentClass) {
      await insert(_class, transaction);
    } else {
      await update({ id: currentClass.get().id, ..._class }, transaction);
    }

    return get({ onChainId }, transaction);
  }, t);

export const incrementNumberOfStudents = (classId: number) =>
  db.classes.increment({ numberOfStudents: 1 }, { where: { id: classId } });
