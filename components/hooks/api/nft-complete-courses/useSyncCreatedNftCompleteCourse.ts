import { useCallback } from 'react';
import { toast } from 'react-toastify';

import {
  CreatedNftGraduation,
  ExchangeNftCompleteCourseBodyData,
} from '@_types/api/certificates';
import { SignatureData } from '@_types/common';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils';
import { selectUser } from '@store/userSlice';
import { useUtilities } from '@hooks/web3';
import { usePromiseHandler } from '@hooks/common';
import { useAppSelector } from '@hooks/stores';

export const useSyncCreatedNftCompleteCourse = () => {
  const { account } = useAppSelector(selectUser);

  return useCallback(
    async (
      _data: ExchangeNftCompleteCourseBodyData,
      signatureData: SignatureData,
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
