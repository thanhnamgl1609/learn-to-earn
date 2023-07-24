import { Transaction } from 'sequelize';

import db from 'models';
import {
  CreatedNftGraduation,
  NftGraduationQuery,
} from '@_types/api/certificates';
import { NftGraduationEntity } from '@_types/models/entities';
import { generateCondition, withTransaction } from '@api/utils';
import { certificatesRepo } from '..';
import { formatGraduation } from './common';

export const get = async (
  query: NftGraduationQuery,
  transaction?: Transaction
): Promise<NftGraduationEntity> => {
  const condition = generateCondition(query, {
    $equal: ['id', 'tokenId', 'studentTokenId'],
  });

  const result = await db.nft_graduations.findOne({
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
  });
  if (!result) return null;
  return formatGraduation(result.get()) as NftGraduationEntity;
};

export const getAll = async (
  query: NftGraduationQuery,
  transaction?: Transaction
): Promise<NftGraduationEntity[]> => {
  const condition = generateCondition(query, {
    $equal: ['id', 'tokenId', 'studentTokenId'],
  });

  const result = await db.nft_graduations.findAll({
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
  });
  return result.map((i) =>
    formatGraduation(i.get())
  ) as NftGraduationEntity[];
};

export const createNftGraduation = (
  data: CreatedNftGraduation,
  t?: Transaction
) =>
  withTransaction(async (transaction) => {
    const { studentTokenId } = data;
    const { nftCompleteCourses, id: requestGraduationId } =
      await certificatesRepo.requestGraduation.get(
        {
          studentTokenId,
        },
        transaction
      );
    const nftCompleteCourseTokenIds = nftCompleteCourses.map(
      ({ tokenId }) => tokenId
    );
    const rawResult = await db.nft_graduations.create(
      {
        ...data,
        requestGraduationId,
      },
      {
        transaction,
      }
    );
    const result = rawResult.get();
    await db.nft_complete_course_graduation_relations.update(
      {
        nftGraduationId: result.tokenId,
      },
      {
        where: { requestGraduationId },
        transaction,
      }
    );
    await db.nft_complete_courses.update(
      { isRegained: 1 },
      {
        where: {
          tokenId: {
            [db.Op.in]: nftCompleteCourseTokenIds,
          },
        },
        transaction,
      }
    );

    return get(result.id, transaction);
  }, t);
