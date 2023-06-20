import { Transaction } from 'sequelize';

import db from 'models';
import {
  CreatedRequestGraduation,
  RequestGraduationQuery,
} from '@_types/api/certificates';
import { RequestGraduationEntity } from '@_types/models/entities';
import { generateCondition, withTransaction } from '@api/utils';
import { formatGraduation } from './common';

export const get = async (
  query: RequestGraduationQuery,
  transaction?: Transaction
): Promise<RequestGraduationEntity> => {
  const condition = generateCondition(query, {
    $equal: ['id', 'studentTokenId'],
  });

  const result = (
    await db.request_graduations.findOne({
      where: condition,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: db.users,
          as: 'student',
          attributes: {
            exclude: ['registerAddress', 'createdAt', 'updatedAt'],
          },
          include: [
            {
              model: db.user_documents,
              as: 'documentURIs',
            },
          ],
        },
        {
          model: db.nft_complete_course_graduation_relations,
          as: 'nftCompleteCourseGraduationRelations',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
          include: [
            {
              model: db.nft_complete_courses,
              as: 'nftCompleteCourse',
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
                      include: [
                        {
                          model: db.user_documents,
                          as: 'documentURIs',
                        },
                      ],
                    },
                    {
                      model: db.knowledge_blocks,
                      as: 'knowledgeBlock',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      transaction,
    })
  ).get() as RequestGraduationEntity;

  return formatGraduation(result) as RequestGraduationEntity;
};

export const getAll = async (
  query: RequestGraduationQuery = {},
  transaction?: Transaction
): Promise<RequestGraduationEntity[]> => {
  const condition = generateCondition(query, {
    $equal: ['id', 'studentTokenId'],
  });

  const result = await db.request_graduations.findAll({
    where: condition,
    include: [
      {
        model: db.users,
        as: 'student',
        attributes: {
          exclude: ['registerAddress'],
        },
      },
    ],
    transaction,
  });

  return result.map((item) => item.get());
};

export const createRequestGraduation = (
  data: CreatedRequestGraduation,
  t?: Transaction
) =>
  withTransaction(async (transaction) => {
    const { nftCompleteCourseTokenIds, ...createdData } = data;
    const rawResult = await db.request_graduations.create(createdData, {
      transaction,
    });
    const result = rawResult.get();
    await db.nft_complete_course_graduation_relations.bulkCreate(
      nftCompleteCourseTokenIds.map((nftCompleteCourseTokenId) => ({
        requestGraduationId: result.id,
        nftCompleteCourseTokenId,
      })),
      {
        transaction,
      }
    );

    return get(result.id, transaction);
  }, t);
