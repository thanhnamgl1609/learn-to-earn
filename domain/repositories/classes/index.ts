import { Transaction } from 'sequelize';
import {
  ClassEntity,
  NftClassRegistrationEntity,
} from '@_types/models/entities';
import { ClassQuery } from '@_types/api/class';
import db from 'models';
import { withTransaction, generateCondition } from '@api/utils';

export const getAll = (query?: ClassQuery, transaction?: Transaction) => {
  const condition = generateCondition(query, {
    $equal: ['onChainId', 'semesterId'],
  });

  return db.classes.findAll({
    where: condition,
    transaction,
    include: [
      {
        attributes: {
          exclude: ['registerAddress'],
        },

        model: db.users,
        as: 'teacher',
      },
      {
        model: db.courses,
        include: [
          {
            model: db.courses,
            as: 'prevCourse',
          },
        ],
      },
    ],
  });
};

export const get = (query?: ClassQuery, transaction?: Transaction) => {
  const condition = generateCondition(query, {
    $equal: ['onChainId', 'semesterId'],
  });

  return db.classes.findOne({
    where: condition,
    transaction,
    include: [
      {
        attributes: {
          exclude: ['registerAddress'],
        },
        model: db.users,
        as: 'teacher',
      },
      {
        model: db.courses,
      },
      {
        model: db.semesters,
      },
    ],
  });
};

export const insert = async (_class: Partial<ClassEntity>, t?: Transaction) =>
  withTransaction(async (transaction: Transaction) => {
    const createdClass = await db.classes.create(_class, {
      transaction,
    });

    return createdClass.get();
  }, t);

export const update = async (_class: Partial<ClassEntity>, t?: Transaction) =>
  withTransaction(async (transaction: Transaction) => {
    const { id, ...updatedClass } = _class;

    return db.classes.update(updatedClass, {
      where: {
        id,
      },
      transaction,
    });
  }, t);

export const upsert = async (_class: Partial<ClassEntity>, t?: Transaction) =>
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

export * from './register';
