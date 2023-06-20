import { logger, request, TIMEOUT } from 'utils';
import moment from 'moment';

import { NftidentityresponseResponse } from '@_types/contracts/NftIdentities';
import { NftIdentity, NftIdentityMetaType } from '@_types/nftIdentity';
import Api from 'config/api.json';
import { ENV_CONST } from '@config/env-const';
import { boolean } from 'zod';

const defaultMeta: NftIdentityMetaType = {
  fullName: '',
  profileImage: `${ENV_CONST.IMAGE_PREFIX}/default_avatar.png`,
  documentURIs: [],
  gender: 0,
  dateOfBirth: new Date('2000-01-01'),
  email: '',
  personalEmail: '',
  identityNumber: '',
  phone: '',
  memberCode: '',
};

export const formatNftIdentity = async (
  { role, nftIdentity, isExpired, tokenURI }: NftidentityresponseResponse,
  {
    useProxy = true,
    timeout = TIMEOUT,
    ignoreMeta = false,
  }: {
    useProxy: boolean;
    timeout?: number;
    ignoreMeta?: boolean;
  } = {
    useProxy: true,
    timeout: TIMEOUT,
    ignoreMeta: false,
  }
): Promise<NftIdentity> => {
  const { expiredAt, register, tokenId } = nftIdentity;
  const coreCourse = {
    role: role.toNumber(),
    expiredAt: moment.unix(expiredAt.toNumber()).toDate(),
    register,
    tokenId: tokenId.toNumber(),
    isExpired,
    tokenURI,
  };
  if (ignoreMeta) {
    return {
      ...coreCourse,
      meta: defaultMeta,
      isUploading: true,
    }
  }
  try {
    const { data: meta } = useProxy
      ? await request.get(Api.proxy, {
          params: {
            l: tokenURI,
          },
          timeout,
        })
      : await request.get(tokenURI);

    return {
      ...coreCourse,
      meta,
    };
  } catch (e) {
    logger(e);
    return {
      ...coreCourse,
      isUploading: true,
      meta: defaultMeta,
    };
  }
};

export const formatNftIdentities = async (
  raws: NftidentityresponseResponse[]
): Promise<NftIdentity[]> =>
  Promise.all(raws.map((raw) => formatNftIdentity(raw)));
