import useSWR, { SWRResponse } from 'swr';

import { ClassEntity } from '@_types/models/entities';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';

export const useRegisterClassesApi = (): SWRResponse<ClassEntity[]> => {
  const result = useSWR([endpoints.registerClasses], useApi(makeRequest()), {
    revalidateOnFocus: false,
  });

  return result;
};
