import { makeRequest } from 'utils';
import endpoints from 'config/endpoints.json';
import { useAppSelector } from '@hooks/stores';
import { selectUser } from '@store/userSlice';
import { useCertificateActions, useUtilities } from '@hooks/web3';
import { useApi } from '@hooks/common';
import { toast } from 'react-toastify';

type Params = {
  data: {
    requestGraduationId: number;
    isApproved: boolean;
    studentTokenId: number;
  };
};

export const useUpdateRequestGraduationStatus = () => {
  const { account } = useAppSelector(selectUser);
  const { getSignedData } = useUtilities();
  const { setExchangableNftGraduation } = useCertificateActions();

  return useApi(
    async ({ data }: Params) => {
      const { isApproved, requestGraduationId, studentTokenId } =
        data;
      await setExchangableNftGraduation({
        studentTokenId,
        isAllowed: isApproved,
      });
      const signature = await getSignedData();
      await makeRequest({
        method: 'PUT',
        data: {
          signature,
          address: account,
          data: {
            isApproved,
            requestGraduationId,
          },
        },
      })([endpoints.requestGraduationStatus]);
      toast.success('Đồng bộ thành công');
    },
    [account]
  );
};
