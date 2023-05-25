import { logger } from 'utils';
import { CreatedNftClassRegistration } from '@_types/api/class';
import { classesRepo } from 'domain/repositories';
import { contract } from '@api/utils/load-contract';
import { createError } from '@api/utils/create-error';
import { formatNftClassRegistrationCore } from '@hooks/web3/formatter/nftClassRegistrationResponses';

export const getNftRegistrationClass = async (tokenId: number) => {
  try {
    const [nftClassRegistration, chainURI] = await Promise.all([
      contract.nftClassRegistration.getNftClassRegistration(tokenId),
      contract.nftClassRegistration.tokenURI(tokenId),
    ]);

    return {
      ...formatNftClassRegistrationCore(nftClassRegistration),
      chainURI,
    };
  } catch (e) {
    logger(e);
    throw createError(400, 'Không đủ quyền');
  }
};

export const registerClass = async (
  tokenId: number,
  studentTokenId: number,
  classId: number,
  chainURI: string
) => {
  const count = await classesRepo.countNftClassRegistrationExisted({ tokenId });
  if (count > 0) throw createError(400);
  const nftClassRegistration: CreatedNftClassRegistration = {
    tokenId,
    studentTokenId,
    classId,
    chainURI,
  };

  return classesRepo.createNftClassRegistration(nftClassRegistration);
};
