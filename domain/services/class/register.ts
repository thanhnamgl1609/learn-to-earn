import { logger } from 'utils';
import { CreatedNftClassRegistration } from '@_types/api/class';
import { UpdateScoreForNftClassRegistrationBodyData } from '@_types/api/certificates';
import ERROR from 'config/error-message.json';
import { formatNftClassRegistrationCore } from '@hooks/web3/formatter/nftClassRegistrationResponses';
import { classesRepo } from 'domain/repositories';
import { contract } from '@api/utils/load-contract';
import { createError } from '@api/utils/create-error';
import { withTransaction } from '@api/utils';

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
  chainURI: string,
  registerDate: string,
  registerFee: number
) => {
  const count = await classesRepo.countNftClassRegistrationExisted({ tokenId });
  if (count > 0) throw createError(400);
  const nftClassRegistration: CreatedNftClassRegistration = {
    tokenId,
    studentTokenId,
    classId,
    chainURI,
    registerDate,
    registerFee,
  };

  return classesRepo.createNftClassRegistration(nftClassRegistration);
};

export const updateScore = (data: UpdateScoreForNftClassRegistrationBodyData) =>
  withTransaction(async (transaction) => {
    const { score, teacherTokenId, tokenId } = data;
    const nftClassRegistration = await classesRepo.getNftClassRegistration(
      {
        tokenId,
      },
      transaction
    );
    // if (nftClassRegistration.class.teacherTokenId === teacherTokenId)
    //   throw createError(400, ERROR.NOT_TEACHER_OF_CLASS);

    const [count] = await classesRepo.updateScore(
      {
        score,
        tokenId,
      },
      transaction
    );

    if (count === 0) throw createError(404, ERROR.UPDATE_ZERO);

    return classesRepo.getNftClassRegistration(
      {
        tokenId,
      },
      transaction
    );
  });
