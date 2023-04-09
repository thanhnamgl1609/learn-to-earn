import request from 'utils/request';
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
  const { data: meta } = await request.get(Api.proxy, {
    params: {
      l: tokenURI,
    },
  });
  const { expiredAt, register, tokenId } = nftIdentity;

  return {
    role: role.toNumber(),
    expiredAt: moment.unix(expiredAt.toNumber()).toDate(),
    register,
    tokenId: tokenId.toNumber(),
    isExpired,
    tokenURI,
    meta,
  };
};

export const formatNftIdentities = async (
  raws: NftidentityresponseResponse[]
): Promise<NftIdentity[]> =>
  Promise.all(raws.map((raw) => formatNftIdentity(raw)));
