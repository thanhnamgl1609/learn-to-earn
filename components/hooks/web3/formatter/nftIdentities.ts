import { logger, request } from 'utils';
import moment from 'moment';

import { NftidentityresponseResponse } from '@_types/contracts/NftIdentities';
import { NftIdentity } from '@_types/nftIdentity';
import Api from 'config/api.json';

export const formatNftIdentity = async ({
  role,
  nftIdentity,
  isExpired,
  tokenURI,
}: NftidentityresponseResponse): Promise<NftIdentity> => {
  const { expiredAt, register, tokenId } = nftIdentity;
  const coreCourse = {
    role: role.toNumber(),
    expiredAt: moment.unix(expiredAt.toNumber()).toDate(),
    register,
    tokenId: tokenId.toNumber(),
    isExpired,
    tokenURI,
  };
  try {
    const { data: meta } = await request.get(Api.proxy, {
      params: {
        l: tokenURI,
      },
    });

    return {
      ...coreCourse,
      meta,
    };
  } catch (e) {
    logger(e);
    return {
      ...coreCourse,
      isUploading: true,
      meta: {
        documentURIs: [],
        fullName: '',
        profileImage: ''
      },
    };
  }
};

export const formatNftIdentities = async (
  raws: NftidentityresponseResponse[]
): Promise<NftIdentity[]> =>
  Promise.all(raws.map((raw) => formatNftIdentity(raw)));
