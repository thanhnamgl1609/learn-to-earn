import useSWR, { SWRResponse } from 'swr';

import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import { Semester } from '@_types/api/semester';

export const useSemesterListApi = (): SWRResponse<Semester[]> => {
  const result = useSWR([endpoints.semesters], useApi(makeRequest()), {
    revalidateOnFocus: false,
  });

  return result;
};
