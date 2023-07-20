import { useCallback } from 'react';

import { CreatedNftCompleteCourse } from '@_types/api/certificates';
import { SignatureData } from '@_types/common';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils';
import { selectUser } from '@store/userSlice';
import { useAppSelector } from '@hooks/stores';

export const useSyncCreatedNftCompleteCourse = () => {
  const { account } = useAppSelector(selectUser);

  return useCallback(
    async (
      _data: CreatedNftCompleteCourse,
      signatureData: SignatureData
    ) => {
      const data = {
        data: _data,
        ...signatureData,
      };

      await makeRequest({
        method: 'POST',
        data,
      })([endpoints.nftCompleteCourse]);
    },
    [account]
  );
};
