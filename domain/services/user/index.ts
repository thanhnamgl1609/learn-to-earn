import CONST from 'config/constants.json';
import { contract } from '@api/utils/load-contract';

const { ROLES } = CONST;

export const getNftIdentityTokenId = async (
  address: string,
  role = ROLES.STUDENT
) => {
  const tokenId = await contract.nftIdentities.getNftTokenIdOfRole(
    address,
    role
  );

  return tokenId.toNumber();
};
