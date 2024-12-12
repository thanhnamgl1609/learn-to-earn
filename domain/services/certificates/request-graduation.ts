import {
  ReceivedCreatedRequestGraduation,
  UpdateRequestGraduationStatusParams,
} from '@_types/api/certificates';
import { certificatesRepo } from 'domain/repositories';
import CONST from 'config/constants.json';
import ERROR_MESSAGE from 'config/error-message.json';
import { logger, today } from 'utils';
import { createError } from '@api/utils/create-error';
import { withTransaction } from '@api/utils';

const { REQUEST_STATUS } = CONST;

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

export const updateRequestGraduationStatus = async (
  data: UpdateRequestGraduationStatusParams
) => {
  const isExist = await certificatesRepo.requestGraduation.count({
    status: REQUEST_STATUS.PENDING,
    id: data.requestGraduationId,
  });

  if (!isExist) {
    throw createError(
      400,
      ERROR_MESSAGE.NOT_REQUEST_GRADUATION_EXIST
    );
  }

  return withTransaction(async (transaction) => {
    const [count] =
      await certificatesRepo.requestGraduation.updateStatus(
        data,
        transaction
      );
    if (count === 0) {
      throw createError(
        400,
        ERROR_MESSAGE.NOT_REQUEST_GRADUATION_EXIST
      );
    }

    return certificatesRepo.requestGraduation.get({
      id: data.requestGraduationId,
    });
  });
};
