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

export const createNftGraduation = (
  data: CreatedNftGraduation,
  t?: Transaction
) =>
  withTransaction(async (transaction) => {
    const { studentTokenId } = data;
    const { requestPrice, uri, nftCompleteCourses } =
      await certificatesRepo.requestGraduation.get(
        {
          studentTokenId,
        },
        transaction
      );
    const nftCompleteCourseTokenIds = nftCompleteCourses.map(
      ({ tokenId }) => tokenId
    );
    const createdData = {
      ...data,
      requestPrice,
      uri,
    };
    const rawResult = await db.nft_graduations.create(createdData, {
      transaction,
    });
    const result = rawResult.get();
    await Promise.all(
      nftCompleteCourseTokenIds.map((nftCompleteCourseTokenId) =>
        db.nft_complete_course_graduation_relations.update(
          {
            requestGraduationId: null,
            nftCompleteCourseTokenId,
            nftGraduationId: result.tokenId,
          },
          {
            where: { nftCompleteCourseTokenId },
            transaction,
          }
        )
      )
    );
    await db.request_graduations.destroy({
      where: { studentTokenId },
      transaction,
    });
    // await db.nft_complete_courses.destroy({
    //   where: {
    //     tokenId: {
    //       [db.Op.in]: nftCompleteCourseTokenIds,
    //     },
    //   },
    // });

    return get(result.id, transaction);
  }, t);
