import { useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';

import { UserDetail, UserQuery } from '@_types/api/user';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import { useApi } from '@hooks/common';
import { CourseEntity } from '@_types/models/entities';

export const useUserListApi = (
  query?: UserQuery
): SWRResponse<UserDetail[]> => {
  const result = useSWR([endpoints.users, query], useApi(makeRequest()), {
    revalidateOnFocus: false,
  });

  return result;
};
