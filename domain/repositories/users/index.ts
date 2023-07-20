import { Transaction } from 'sequelize';
import { UserDetail, UserQuery } from '@_types/api/user';
import db from 'models';
import { withTransaction, generateCondition } from '@api/utils';
import CONST from 'config/constants.json';
import {
  NftIdentity,
  NftIdentityMetaType,
} from '@_types/nftIdentity';
import { before } from 'utils';
import { formatGraduation } from '../certificates/common';
import { certificatesRepo } from '..';
import { UserEntity } from '@_types/models/entities';

const { ROLES } = CONST;

const MEMBER_CODE_PREFIX = {
  [ROLES.STUDENT]: 'SV',
  [ROLES.TEACHER]: 'TC',
};

export const getAll = async (
  query?: UserQuery,
  transaction?: Transaction
) => {
  const condition = generateCondition(query, {
    $equal: ['role'],
  });

  const allUsers = await db.users.findAll({
    attributes: {
      exclude: ['registerAddress'],
    },
    where: {
      ...condition,
      tokenId: {
        [db.Op.not]: null,
      },
    },
    transaction,
  });

  return allUsers.map((user) => {
    const _user: UserDetail = user.get();

    return {
      ..._user,
      isExpired: before(_user.expiredAt),
    };
  });
};

export const get = async (
  query?: UserQuery,
  transaction?: Transaction
) => {
  const condition = generateCondition(query, {
    $equal: ['tokenId'],
  });

  const _user = await db.users.findOne({
    attributes: {
      exclude: ['registerAddress'],
    },
    where: condition,
    transaction,
    include: [
      {
        model: db.user_documents,
        as: 'documentURIs',
      },
      {
        model: db.request_graduations,
        as: 'requestGraduations',
      },
      {
        model: db.nft_graduations,
        as: 'nftGraduation',
        include: [
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
      },
      {
        model: db.nft_class_registrations,
        as: 'nftClassRegistrations',
        include: [
          {
            model: db.classes,
          },
        ],
      },
    ],
  });

  if (!_user) return null;
  const user: UserEntity = _user?.get();
  const isStudent = user?.role === ROLES.STUDENT;
  if (isStudent) {
    user.nftGraduation = await certificatesRepo.nftGraduation.get({
      studentTokenId: user.tokenId,
    });
    user.requestGraduations = user.requestGraduations.sort(
      ({ id: id1 }, { id: id2 }) => (id1 > id2 ? -1 : 1)
    );
    user.requestGraduation = user.requestGraduations[0];
  }

  return user;
};

export const getMaxId = async (query: {
  role?: number;
}): Promise<number> => {
  const condition = generateCondition(query, {
    $equal: ['role'],
  });

  const result = await db.users.count({
    where: condition,
  });

  return result;
};

export const getMemberCode = async (role: number) => {
  const prefix = MEMBER_CODE_PREFIX[role];
  const maxIdOfRole = await getMaxId({ role });
  const nextId = `${maxIdOfRole + 1}`;
  const pre = `${prefix}000000`.substring(0, 8 - nextId.length);

  return `${pre}${nextId}`;
};

export const insert = async (
  nftIdentity: NftIdentity,
  t?: Transaction
) =>
  withTransaction(async (transaction: Transaction) => {
    const {
      tokenId,
      register: registerAddress,
      role,
      expiredAt,
      tokenURI: chainURI,
      meta: { documentURIs, ...meta },
    } = nftIdentity;

    const user = await db.users.create(
      {
        ...meta,
        tokenId,
        registerAddress,
        role,
        expiredAt,
        chainURI,
      },
      {
        transaction,
      }
    );
    const userInstance = user.get();
    if (documentURIs?.length) {
      const userDocuments = documentURIs.map((uri) => ({
        userId: userInstance.id,
        uri,
      }));
      await db.user_documents.bulkCreate(userDocuments, {
        transaction,
      });
    }
    return user;
  }, t);

export const update = async (
  nftIdentity: NftIdentity,
  t?: Transaction
) =>
  withTransaction(async (transaction: Transaction) => {
    const {
      tokenId,
      register: registerAddress,
      role,
      expiredAt,
      tokenURI: chainURI,
      meta,
    } = nftIdentity;
    return db.users.update(
      {
        ...meta,
        tokenId,
        registerAddress,
        role,
        expiredAt,
        chainURI,
      },
      {
        where: {
          tokenId,
        },
        transaction,
      }
    );
  }, t);

export const upsert = async (
  nftIdentity: NftIdentity,
  backupMetaData: NftIdentityMetaType,
  t?: Transaction
) =>
  withTransaction(async (transaction: Transaction) => {
    const { tokenId } = nftIdentity;
    const _nftIdentity = { ...nftIdentity };
    if (nftIdentity.isUploading) {
      _nftIdentity.meta = backupMetaData;
    }
    // const currentNftIdentity = await get({ tokenId }, transaction);
    // if (!currentNftIdentity) {
    await insert(_nftIdentity, transaction);
    // } else {
    // await update(_nftIdentity, transaction);
    // }

    return get({ tokenId }, transaction);
  }, t);
