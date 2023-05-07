import { GetRegisterTimeResponse } from '@_types/contracts/NftSchool';
import { RegisterTime } from '@_types/school';
import { parseBigNumberFields, parseDate } from 'utils';

export const formatRegisterTime = (
  data: GetRegisterTimeResponse
): RegisterTime => {
  const { 0: registerStartTimestamp, 1: registerEndTimestamp } =
    parseBigNumberFields(data, [0, 1]);

  return {
    registerStartAt: registerStartTimestamp
      ? parseDate(registerStartTimestamp)
      : null,
    registerEndAt: registerEndTimestamp
      ? parseDate(registerEndTimestamp)
      : null,
  };
};
