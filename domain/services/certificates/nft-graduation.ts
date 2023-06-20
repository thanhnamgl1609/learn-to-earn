import { certificatesRepo } from 'domain/repositories';
import { CreatedNftGraduation } from '@_types/api/certificates';
import { logger } from 'utils';

export const syncNftGraduation = async (
  nftGraduation: CreatedNftGraduation
) => {
  let result = null;

  try {
    result = await certificatesRepo.nftGraduation.createNftGraduation(
      nftGraduation
    );
  } catch (e) {
    logger(e);
  }

  return result;
};
