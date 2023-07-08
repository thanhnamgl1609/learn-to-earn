import { certificatesRepo } from 'domain/repositories';
import { CreatedRequestGraduation } from '@_types/api/certificates';
import { logger } from 'utils';

export const syncRequestGraduation = async (
  requestGraduation: CreatedRequestGraduation
) => {
  let result = null;

  try {
    result = await certificatesRepo.requestGraduation.createRequestGraduation(
      requestGraduation
    );
  } catch (e) {
    logger(e);
  }

  return result;
};
