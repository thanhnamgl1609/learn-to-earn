import { useCallback } from 'react';
import { makeRequest } from 'utils';
import endpoints from 'config/endpoints.json';
import { useAppSelector } from '@hooks/stores';
import { selectUser } from '@store/userSlice';
import { useUtilities } from '@hooks/web3';

type Params = {
  signature?: string;
  data: {
    studentTokenId: number;
    nftCompleteCourseTokenIds: number[];
    nationalDefenseEduCertificate?: string;
    foreignLanguageCertificate?: string;
    others?: string[];
  };
};

export const useSyncRequestGraduationDetail = () => {
  const { account } = useAppSelector(selectUser);
  const { getSignedData } = useUtilities();

  return useCallback(
    async ({ signature: _signature, data }: Params) => {
      let signature = _signature;
      if (!signature) {
        signature = await getSignedData();
      }
      await makeRequest({
        method: 'POST',
        data: {
          signature,
          address: account,
          data,
        },
      })([endpoints.syncRequestGraduationDetail]);
    },
    [account]
  );
};
