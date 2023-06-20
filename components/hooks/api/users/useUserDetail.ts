import { UserQuery } from '@_types/api/user';
import { makeRequest } from 'utils';
import endpoints from 'config/endpoints.json';
import { useApi } from '@hooks/common';
import { UserEntity } from '@_types/models/entities';

export const useUserDetail = () =>
  useApi(
    (params: UserQuery): Promise<UserEntity> =>
      makeRequest()([endpoints.userDetail, params]),
    []
  );
