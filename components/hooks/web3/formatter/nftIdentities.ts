import { NftidentityresponseResponse } from '@_types/contracts/NftIdentities';
import { NftIdentity } from '@_types/nftIdentity';
import axios from 'axios';
import moment from 'moment';

export const formatNftIdentity = async ({
  role,
  nftIdentity,
  isExpired,
  tokenURI,
}: NftidentityresponseResponse): Promise<NftIdentity> => {
  const { data: meta } = await axios.get(tokenURI);
  const { expiredAt, register, tokenId } = nftIdentity;

  return {
    role: role.toNumber(),
    expiredAt: moment(expiredAt.toNumber()).toDate(),
    register,
    tokenId: role.toNumber(),
    isExpired,
    tokenURI,
    meta,
  };
};

export const formatNftIdentities = async (
  raws: NftidentityresponseResponse[]
): Promise<NftIdentity[]> =>
  Promise.all(raws.map((raw) => formatNftIdentity(raw)));
