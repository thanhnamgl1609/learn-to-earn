import useSWR, { SWRResponse } from 'swr';

import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import { SemesterDetail } from '@_types/api/semester';
import { useSchoolActions } from '@hooks/web3';

export const useCurrentYear = (): SWRResponse<SemesterDetail[]> => {
  const { getRegisterTime } = useSchoolActions();

  const result = useSWR(
    endpoints.currentYear,
    useApi(async (url) => {
      const response = (await makeRequest()([url])) as SemesterDetail[];
      const responseWithRegisterTime: SemesterDetail[] = await Promise.all(
        response.map(async (semesterDetail) => {
          const { registerEndAt, registerStartAt } = await getRegisterTime(
            semesterDetail.id
          );
          return {
            ...semesterDetail,
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
