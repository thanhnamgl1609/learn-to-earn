import { useCallback } from 'react';
import { makeRequest } from 'utils';
import { UpdateScoreForNftClassRegistrationParams } from '@_types/certificate';
import { SignatureData } from '@_types/common';
import endpoints from 'config/endpoints.json';
import { useUtilities } from '@hooks/web3';
import { useAppSelector } from '@hooks/stores';
import { selectCurrentNftIdentity, selectUser } from '@store/userSlice';

export const useUpdateScoreForNftClassRegistration = () => {
  const { tokenId } = useAppSelector(selectCurrentNftIdentity);
  const { account } = useAppSelector(selectUser);
  const { getSignedData } = useUtilities();

  return useCallback(
    async (
      params: UpdateScoreForNftClassRegistrationParams,
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

      await makeRequest({
        method: 'PUT',
        data: {
          data: {
            ...params,
            teacherTokenId: tokenId,
          },
          ..._signatureData,
        },
      })([endpoints.nftClassRegistration]);
    },
    [account, tokenId]
  );
};
