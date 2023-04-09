import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { getError } from '@validators/zod';

import { RegistrationInfo } from '@_types/nftIdentity';
import Routes from '@config/routes.json';
import { useRegistrationActions } from '@hooks/web3';
import { GRANT_OR_REJECT_IDENTITY } from '@validators/schemas';
import { useValidator } from '@hooks/form';

export const useGrantNftIdentity = (
  formState: RegistrationInfo & { expiredAt: string }
) => {
  const router = useRouter();
  const { grantNftIdentity } = useRegistrationActions();
  const validator = useValidator(GRANT_OR_REJECT_IDENTITY);
  const managementURL = `${Routes.manageRegistration.name}?r=${formState.role}`;

  return useCallback(async () => {
    const onSuccess = () => router.push(managementURL);
    if (!validator(formState)) return;
    await grantNftIdentity({ ...formState, onSuccess });
  }, [formState]);
};
