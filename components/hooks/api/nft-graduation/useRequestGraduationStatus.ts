import { useAppSelector } from '@hooks/stores';
import { useCertificateActions } from '@hooks/web3';
import { selectCurrentNftIdentity, selectUser } from '@store/userSlice';
import { RequestGraduationEntity } from '@_types/models/entities';
import useSWR, { SWRResponse } from 'swr';
import { getRequestGraduationDetail } from './useRequestGraduationDetail';

type Response = {
  isApprovedSent: boolean;
  isInQueue: boolean;
  requestGraduation?: RequestGraduationEntity;
};

export const useRequestGraduationStatus = (): SWRResponse<Response> => {
  const { account } = useAppSelector(selectUser);
  const { tokenId } = useAppSelector(selectCurrentNftIdentity);
  const { checkApproveNftCertificates, checkGraduationRequestInQueue } =
    useCertificateActions();

  const result = useSWR(
    [tokenId, account],
    async ([studentTokenId, address]) => {
      const isApprovedSent = await checkApproveNftCertificates(address);
      const isInQueue = await checkGraduationRequestInQueue(studentTokenId);
      if (isInQueue) {
        const requestGraduation = await getRequestGraduationDetail({
          studentTokenId,
        });

        return {
          requestGraduation,
          isInQueue,
          isApprovedSent,
        };
      }

      return { isApprovedSent, isInQueue } as Response;
    }
  );

  return result;
};
