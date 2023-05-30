import { Transaction } from 'sequelize';

import db from 'models';
import {
  CreatedNftCompleteCourse,
  NftCompleteCourseQuery,
} from '@_types/api/certificates';
import { generateCondition, withTransaction } from '@api/utils';
import { NftCompleteCourseEntity } from '@_types/models/entities';

export const get = async (
  query: NftCompleteCourseQuery,
  transaction?: Transaction
): Promise<NftCompleteCourseEntity> => {
  const condition = generateCondition(query, {
    $equal: ['id', 'tokenId', 'studentTokenId'],
  });

  const result = await db.nft_complete_courses.findOne({
    where: condition,
    include: [
      {
        model: db.users,
        as: 'student',
        attributes: {
          exclude: ['registerAddress'],
        },
      },
      {
        model: db.classes,
        include: [
          {
            model: db.courses,
          },
          {
            model: db.users,
            as: 'teacher',
            attributes: {
              exclude: ['registerAddress'],
            },
          },
          {
            model: db.knowledge_blocks,
            as: 'knowledgeBlock',
          },
        ],
      },
    ],
    transaction,
  });

  return result.get();
};

export const getAll = async (
  query: NftCompleteCourseQuery,
  transaction?: Transaction
): Promise<NftCompleteCourseEntity[]> => {
  const condition = generateCondition(query, {
    $equal: ['id', 'tokenId', 'studentTokenId'],
  });

  const result = await db.nft_complete_courses.findAll({
    where: condition,
    include: [
      {
        model: db.users,
        as: 'student',
        attributes: {
          exclude: ['registerAddress'],
        },
      },
      {
        model: db.classes,
        include: [
          {
            model: db.courses,
          },
          {
            model: db.users,
            as: 'teacher',
            attributes: {
              exclude: ['registerAddress'],
            },
          },
          {
            model: db.knowledge_blocks,
            as: 'knowledgeBlock',
          },
        ],
      },
    ],
    transaction,
  });

  return result.map((i) => i.get());
};

export const createNftCompleteCourse = (
  data: CreatedNftCompleteCourse,
  t?: Transaction
) =>
  withTransaction(async (transaction) => {
    const result = await db.nft_complete_courses.create(data, {
      transaction,
    });

    return get(result.get().id, transaction);
  }, t);
