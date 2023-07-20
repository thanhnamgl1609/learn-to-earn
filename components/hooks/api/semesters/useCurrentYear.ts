import useSWR, { SWRResponse } from 'swr';

import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import { SemesterEntity } from '@_types/models/entities';
import { useSchoolActions } from '@hooks/web3';
import { between } from 'utils';
import { SemesterDetail } from '@_types/api/semester';

export const useCurrentYear = (): SWRResponse<SemesterDetail[]> => {
  const { getRegisterTime } = useSchoolActions();

  const result = useSWR(
    endpoints.currentYear,
    useApi(async (url) => {
      const response = (await makeRequest()([
        url,
      ])) as SemesterDetail[];
      const responseWithRegisterTime: SemesterDetail[] =
        await Promise.all(
          response.map(async (semesterDetail) => {
            const { registerEndAt, registerStartAt } =
              await getRegisterTime(semesterDetail.id);
            const isInRegisterTime = between(
              registerStartAt,
              registerEndAt
            );
            return {
              ...semesterDetail,
              isInRegisterTime,
              registerStartAt,
              registerEndAt,
            };
          })
        );

      return responseWithRegisterTime;
    }),
    {
      revalidateOnFocus: false,
    }
  );

  return result;
};
