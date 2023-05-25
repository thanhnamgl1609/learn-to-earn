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
import db from 'models';
import { withTransaction, generateCondition } from '@api/utils';

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
    $equal: ['tokenId', 'studentTokenId', 'classId'],
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
    $equal: ['tokenId'],
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
