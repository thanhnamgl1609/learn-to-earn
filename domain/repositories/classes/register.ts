import { Transaction } from 'sequelize';
import {
  ClassEntity,
  NftClassRegistrationEntity,
} from '@_types/models/entities';
import {
  ClassQuery,
  CreatedNftClassRegistration,
  NftClassRegistrationQuery,
} from '@_types/api/class';
import CONST from 'config/constants.json';
import db from 'models';
import { withTransaction, generateCondition } from '@api/utils';
import { UpdateScoreForNftClassRegistrationBodyData } from '@_types/api/certificates';

const { MINIMUM_SCORE_FOR_GRADUATION } = CONST;

export const countNftClassRegistrationExisted = async (
  query: NftClassRegistrationQuery
): Promise<number> => {
  const condition = generateCondition(query, {
    $equal: ['tokenId'],
  });

  return db.nft_class_registrations.count({
    where: condition,
  });
};

export const getNftClassRegistrations = async (
  query: NftClassRegistrationQuery,
  transaction?: Transaction
): Promise<NftClassRegistrationEntity[]> => {
  const condition = generateCondition(query, {
    $equal: ['tokenId', 'studentTokenId', 'classId', 'isRegained'],
  });

  const result = await db.nft_class_registrations.findAll({
    where: condition,
    include: [
      {
        model: db.classes,
        include: [
          {
            model: db.courses,
          },
          {
            attributes: {
              exclude: ['registerAddress'],
            },
            model: db.users,
            as: 'teacher',
          },
          {
            model: db.knowledge_blocks,
            as: 'knowledgeBlock',
          },
        ],
      },
      {
        model: db.users,
        attributes: {
          exclude: ['registerAddress'],
        },
        as: 'student',
      },
    ],
    transaction,
  });

  return result.map((item) => item.get());
};

export const getNftClassRegistration = async (
  query: NftClassRegistrationQuery,
  transaction?: Transaction
): Promise<NftClassRegistrationEntity> => {
  const condition = generateCondition(query, {
    $equal: ['tokenId', 'classId', 'studentTokenId'],
  });

  const result = await db.nft_class_registrations.findOne({
    where: condition,
    include: [
      {
        model: db.classes,
        include: [
          {
            model: db.courses,
          },
          {
            attributes: {
              exclude: ['registerAddress'],
            },
            model: db.users,
            as: 'teacher',
          },
          {
            model: db.knowledge_blocks,
            as: 'knowledgeBlock',
          },
        ],
      },
      {
        model: db.users,
        attributes: {
          exclude: ['registerAddress'],
        },
        as: 'student',
      },
    ],
    transaction,
  });

  return result?.get();
};

export const createNftClassRegistration = (
  nftClassRegistration: CreatedNftClassRegistration,
  t?: Transaction
): Promise<NftClassRegistrationEntity> =>
  withTransaction(async (transaction) => {
    const { tokenId } = nftClassRegistration;
    await db.nft_class_registrations.create(nftClassRegistration, {
      transaction,
    });

    return getNftClassRegistration({ tokenId }, transaction);
  }, t);

export const updateScore = async (
  data: Omit<
    UpdateScoreForNftClassRegistrationBodyData,
    'teacherTokenId'
  >,
  t?: Transaction
) =>
  withTransaction(
    async (transaction) =>
      await db.nft_class_registrations.update(
        {
          isExchangeable:
            data.score >= MINIMUM_SCORE_FOR_GRADUATION ? 1 : 0,
          score: data.score,
        },
        {
          where: {
            tokenId: data.tokenId,
          },
          transaction,
        }
      ),
    t
  );

export const updateRegainedClass = async (
  classId: number,
  studentTokenId: number,
  t?: Transaction
) =>
  withTransaction(
    async (transaction) =>
      await db.nft_class_registrations.update(
        { isRegained: 1 },
        {
          where: {
            classId,
            studentTokenId,
          },
          transaction,
        }
      ),
    t
  );
