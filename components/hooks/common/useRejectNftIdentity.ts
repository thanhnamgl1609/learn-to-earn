import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { RegistrationInfo } from '@_types/nftIdentity';
import Routes from '@config/routes.json';
import { useRegistrationActions } from '@hooks/web3';

export const useRejectNftIdentity = ({ role, applicant }) => {
  const router = useRouter();
  const { rejectNftIdentity } = useRegistrationActions();
  const managementURL = `${Routes.manageRegistration.name}?r=${role}`;

  return useCallback(() => {
    const onSuccess = () => router.push(managementURL);

    rejectNftIdentity({ role, applicant, onSuccess });
  }, []);
};
