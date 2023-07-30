import { Transaction } from 'sequelize';
import { ClassEntity } from '@_types/models/entities';
import { ClassQuery } from '@_types/api/class';
import db from 'models';
import { withTransaction, generateCondition } from '@api/utils';
import { between } from 'utils';

const formatItem = (item: ClassEntity) => ({
  ...item,
  isCurrent: between(item.startAt, item.completeAt),
});

export const getAll = async (
  query?: ClassQuery,
  transaction?: Transaction
) => {
  const condition = generateCondition(query, {
    $equal: ['onChainId', 'semesterId', 'teacherTokenId'],
  });

  const classes = await db.classes.findAll({
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
      {
        model: db.knowledge_blocks,
        as: 'knowledgeBlock',
      },
    ],
  });

  return classes.map((item) => formatItem(item.get()));
};

export const get = async (
  query?: ClassQuery,
  transaction?: Transaction
): Promise<ClassEntity> => {
  const condition = generateCondition(query, {
    $equal: ['onChainId', 'semesterId', 'teacherTokenId'],
  });

  const result = await db.classes.findOne({
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
      {
        model: db.knowledge_blocks,
        as: 'knowledgeBlock',
      },
    ],
  });

  return formatItem(result?.get());
};

export const insert = async (
  _class: Partial<ClassEntity>,
  t?: Transaction
) =>
  withTransaction(async (transaction: Transaction) => {
    const createdClass = await db.classes.create(_class, {
      transaction,
    });

    return createdClass.get();
  }, t);

export const update = async (
  _class: Partial<ClassEntity>,
  t?: Transaction
) =>
  withTransaction(async (transaction: Transaction) => {
    const { id, ...updatedClass } = _class;

    return db.classes.update(updatedClass, {
      where: {
        id,
      },
      transaction,
    });
  }, t);

export const upsert = async (
  _class: Partial<ClassEntity>,
  t?: Transaction
) =>
  withTransaction(async (transaction: Transaction) => {
    const { onChainId } = _class;
    const currentClass = await get({ onChainId }, transaction);

    if (!currentClass) {
      await insert(_class, transaction);
    } else {
      await update({ id: currentClass.id, ..._class }, transaction);
    }

    return get({ onChainId }, transaction);
  }, t);

export const incrementNumberOfStudents = (classId: number) =>
  db.classes.increment(
    { numberOfStudents: 1 },
    { where: { id: classId } }
  );

export * from './register';
