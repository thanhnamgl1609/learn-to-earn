import useSWR, { SWRResponse } from 'swr';

import { NftClassRegistrationEntity } from '@_types/models/entities';
import CONST from 'config/constants.json';
import {
  NftClassRegistrationEntityWithApproveStatus,
  NftClassRegistrationQuery,
} from '@_types/api/class';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils/request';
import {
  useCertificateActions,
  useNftClassRegistrationActions,
} from '@hooks/web3';
import { useApi } from '@hooks/common';

type Option = {
  account?: string;
  withApprove?: boolean;
  withApproveSent?: boolean;
};

const { ZERO_ADDRESS } = CONST;

export const useNftRegistrationClassListApi = (
  query: NftClassRegistrationQuery,
  option: Option = {
    account: '',
    withApprove: false,
    withApproveSent: false,
  }
): SWRResponse<NftClassRegistrationEntityWithApproveStatus[]> => {
  const {
    getNumberOfStudentsOfClass,
    getApprovalOfTokenId,
    checkNftClassRegistrationRegained,
  } = useNftClassRegistrationActions();
  const { getNftCompleteCourseCreationCreationQueue } = useCertificateActions();

  const getter = useApi(
    async (params: [string, NftClassRegistrationEntityWithApproveStatus]) => {
      const [, { classId }] = params;
      const { account, withApprove, withApproveSent } = option;
      const nftClassRegistrationsPromise = makeRequest()(params) as Promise<
        NftClassRegistrationEntity[]
      >;
      const [nftClassRegistrations, creationQueue] = await Promise.all([
        nftClassRegistrationsPromise,
        classId
          ? getNftCompleteCourseCreationCreationQueue(classId)
          : ([] as number[]),
      ]);
      const creationQueueOn = creationQueue.reduce(
        (prev, current) => ({ ...prev, [current]: true }),
        {}
      );
      const nftClassRegistrationWithNumberOfStudents = await Promise.all(
        nftClassRegistrations.map(async ({ class: _class, ...other }) => {
          const { onChainId } = _class;
          const isRegained = await checkNftClassRegistrationRegained(
            other.studentTokenId,
            _class.id
          );

          const [numberOfStudents, approval] = await Promise.all([
            getNumberOfStudentsOfClass(onChainId),
            (withApprove || withApproveSent) && !isRegained
              ? getApprovalOfTokenId(onChainId)
              : '',
          ]);
          const isApproved = withApprove && approval === account;
          const isApprovedSent = !!approval && approval !== ZERO_ADDRESS;
          const isInQueue = creationQueueOn[other.studentTokenId];

          return {
            ...other,
            class: {
              ..._class,
              numberOfStudents,
            },
            isApproved,
            isApprovedSent,
            isRegained,
            isInQueue,
          };
        })
      );

      return nftClassRegistrationWithNumberOfStudents as NftClassRegistrationEntityWithApproveStatus[];
    }
  );

  const result = useSWR([endpoints.nftClassRegistration, query], getter, {
    revalidateOnFocus: false,
  });

  return result;
};
