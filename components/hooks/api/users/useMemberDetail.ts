import useSWR, { SWRResponse } from 'swr';
import { UserQuery } from '@_types/api/user';
import { makeRequest } from 'utils';
import endpoints from 'config/endpoints.json';
import { useApi } from '@hooks/common';
import { UserEntity } from '@_types/models/entities';

export const useMemberDetail = (
  query: UserQuery
): SWRResponse<UserEntity> => {
  const getter = useApi(async (params: [string, UserQuery]) => {
    const userDetail = (await makeRequest()(params)) as UserEntity;

    return userDetail as UserEntity;
  });

  const result = useSWR([endpoints.userDetail, query], getter, {});

  return result;
};
