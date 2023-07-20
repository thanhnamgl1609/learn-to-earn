import { Transaction } from 'sequelize';

import db from 'models';
import {
  CreatedNftCompleteCourse,
  KnowledgeBlockListResponse,
  NftCompleteCourseQuery,
} from '@_types/api/certificates';
import { generateCondition, withTransaction } from '@api/utils';
import {
  KnowledgeBlockEntity,
  NftCompleteCourseEntity,
} from '@_types/models/entities';
import { floor } from 'utils';

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
    $in: [['nftCompleteCourseTokenIds', 'tokenId']],
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

export const getGroupByKnowledge = async (
  query: NftCompleteCourseQuery,
  transaction?: Transaction
): Promise<KnowledgeBlockListResponse> => {
  const condition = generateCondition(query, {
    $equal: ['id', 'tokenId', 'studentTokenId'],
  });

  const result = await db.knowledge_blocks.findAll({
    include: [
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
            model: db.nft_complete_courses,
            as: 'nftCompleteCourses',
            where: condition,
            required: true,
            include: [
              {
                model: db.users,
                as: 'student',
                attributes: {
                  exclude: ['registerAddress'],
                },
              },
            ],
          },
        ],
      },
    ],
    transaction,
  });
  let totalCredits = 0;
  let totalScore = 0;

  const knowledgeBlockWithScore = result.map((i) => {
    const item = i.get() as KnowledgeBlockEntity;
    const { classes } = item;

    if (classes.length) {
      const gained = classes.reduce(
        (prev, { nftCompleteCourses, credits }) => ({
          totalCredits: prev.totalCredits + credits,
          totalScore:
            prev.totalScore +
            nftCompleteCourses[0].avgScore * credits,
        }),
        {
          totalCredits: 0,
          totalScore: 0,
        }
      );
      const avgScore = floor(
        gained.totalScore / gained.totalCredits,
        2
      );
      totalCredits += gained.totalCredits;
      totalScore += gained.totalScore;
      return {
        ...item,
        ...gained,
        avgScore,
      };
    } else {
      return {
        ...item,
        totalCredits: 0,
        totalScore: 0,
        avgScore: 0,
      };
    }
  });

  return {
    totalCredits,
    totalScore,
    avgScore: totalCredits ? floor(totalScore / totalCredits, 2) : 0,
    list: knowledgeBlockWithScore,
  };
};

export const createNftCompleteCourse = (
  data: CreatedNftCompleteCourse,
  t?: Transaction
) =>
  withTransaction(async (transaction) => {
    const result = await db.nft_complete_courses.create(data, {
      transaction,
    });

    return get({ id: result.get().id }, transaction);
  }, t);
