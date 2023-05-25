import CONST from 'config/constants.json';
import { classesRepo, semestersRepo } from 'domain/repositories';
import { TIMEOUT } from 'utils';
import { contract } from '@api/utils/load-contract';
import { formatClassResponse } from '@hooks/web3/formatter';
import { createError } from '@api/utils/create-error';

const { ROLES } = CONST;

export const getStudentTokenIdFromContract = async (address: string) => {
  const tokenId = await contract.nftIdentities.getNftTokenIdOfRole(
    address,
    ROLES.STUDENT
  );

  return tokenId.toNumber();
};
