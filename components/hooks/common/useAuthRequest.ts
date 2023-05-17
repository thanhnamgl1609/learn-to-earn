import { useCallback } from 'react';

import { selectUser } from '@store/userSlice';
import { request } from 'utils';
import { useAppSelector } from '@hooks/stores';
import { useApi } from './useApi';

export const useAuthRequest = () => {
  const { signature, account: address } = useAppSelector(selectUser);

  return useApi(
    ({ method, url, data }) =>
      request({
        method,
        url,
        data: {
          ...data,
          signature,
          address,
        },
      }),
    [signature, address]
  );
};
