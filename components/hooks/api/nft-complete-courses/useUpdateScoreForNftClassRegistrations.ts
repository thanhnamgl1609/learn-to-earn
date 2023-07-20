import { useCallback } from 'react';
import { makeRequest } from 'utils';
import { UpdateScoreForNftClassRegistrationParams } from '@_types/certificate';
import { SignatureData } from '@_types/common';
import endpoints from 'config/endpoints.json';
import { useUtilities } from '@hooks/web3';
import { useAppSelector } from '@hooks/stores';
import {
  selectCurrentNftIdentity,
  selectUser,
} from '@store/userSlice';
import { NftClassRegistrationEntity } from '@_types/models/entities';
import { toast } from 'react-toastify';

export const useUpdateScoreForNftClassRegistrations = () => {
  const { tokenId } = useAppSelector(selectCurrentNftIdentity);
  const { account } = useAppSelector(selectUser);
  const { getSignedData } = useUtilities();

  return useCallback(
    async (
      params: NftClassRegistrationEntity[],
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
          data: params,
          ..._signatureData,
        },
      })([endpoints.nftClassRegistrationList]);
      toast.success('Đông bộ thành công');
    },
    [account, tokenId]
  );
};
