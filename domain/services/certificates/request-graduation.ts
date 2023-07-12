import { certificatesRepo } from 'domain/repositories';
import { ReceivedCreatedRequestGraduation } from '@_types/api/certificates';
import { logger, today } from 'utils';

export const syncRequestGraduation = async (
  requestGraduation: ReceivedCreatedRequestGraduation
) => {
  let result = null;

  try {
    result =
      await certificatesRepo.requestGraduation.createRequestGraduation(
        {
          ...requestGraduation,
          requestDate: today(),
        }
      );
  } catch (e) {
    logger(e);
  }

  return result;
};
