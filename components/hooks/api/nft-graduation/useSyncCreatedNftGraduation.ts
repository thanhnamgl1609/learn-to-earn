import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { CreatedNftGraduation } from '@_types/api/certificates';
import { SignatureData } from '@_types/common';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils';
import { selectUser } from '@store/userSlice';
import { useUtilities } from '@hooks/web3';
import { usePromiseHandler } from '@hooks/common';
import { useAppSelector } from '@hooks/stores';

export const useSyncCreatedNftGraduation = () => {
  const { account } = useAppSelector(selectUser);
  const { getSignedData } = useUtilities();
  const promiseHandler = usePromiseHandler();

  return useCallback(
    async (
      createdNftGraduation: Omit<
        CreatedNftGraduation,
        'nftCompleteCourseTokenIds'
      >,
      signatureData?: SignatureData
    ) => {
      let _signatureData = signatureData;

      if (!_signatureData) {
        const signature = await getSignedData();
        _signatureData = {
          signature,
          address: account,
        };
      }

      const promise = makeRequest({
        method: 'POST',
        data: {
          data: createdNftGraduation,
          ..._signatureData,
        },
      })([endpoints.syncNftGraduationDetail]);

      await promiseHandler({
        successMsg: 'Đồng bộ NFT tốt nghiệp thành công',
        errorMsg: 'Đồng bộ NFT tốt nghiệp thất bại',
        promise,
      });
    },
    []
  );
};
