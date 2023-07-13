import { makeRequest } from 'utils';
import endpoints from 'config/endpoints.json';
import { useAppSelector } from '@hooks/stores';
import { selectUser } from '@store/userSlice';
import { useUtilities } from '@hooks/web3';
import { useApi } from '@hooks/common';

type Params = {
  data: {
    requestGraduationId: number;
    isApproved: boolean;
  };
};

export const useUpdateRequestGraduationStatus = () => {
  const { account } = useAppSelector(selectUser);
  const { getSignedData } = useUtilities();

  return useApi(
    async ({ data }: Params) => {
      const signature = await getSignedData();
      await makeRequest({
        method: 'PUT',
        data: {
          signature,
          address: account,
          data,
        },
      })([endpoints.requestGraduationStatus]);
    },
    [account]
  );
};
