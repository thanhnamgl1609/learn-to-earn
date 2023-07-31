import useSWR, { SWRResponse } from 'swr';

import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import { SemesterEntity } from '@_types/models/entities';
import { useSchoolActions } from '@hooks/web3';
import { between } from 'utils';

export const useCurrentSemester = (): SWRResponse<SemesterEntity> => {
  const { getRegisterTime } = useSchoolActions();

  const result = useSWR(
    [endpoints.currentSemesters],
    useApi(async (url) => {
      const response = (await makeRequest()([url])) as SemesterEntity;
      const { registerEndAt, registerStartAt } =
        await getRegisterTime(response.id);
      const isInRegisterTime = between(
        registerStartAt,
        registerEndAt
      );
      return {
        ...response,
        registerStartAt,
        registerEndAt,
        isInRegisterTime,
      } as SemesterEntity;
    }),
    {}
  );

  return result;
};
