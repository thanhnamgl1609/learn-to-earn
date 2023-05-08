import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { getError } from '@validators/zod';

import { NftIdentity, RegistrationInfo } from '@_types/nftIdentity';
import Routes from '@config/routes.json';
import { useRegistrationActions } from '@hooks/web3';
import { GRANT_OR_REJECT_IDENTITY } from '@validators/schemas';
import { useValidator } from '@hooks/form';

export const useGrantNftIdentity = () => {
  const { grantNftIdentity } = useRegistrationActions();

  return useCallback(async (nftIdentity: NftIdentity) => {
    await grantNftIdentity(nftIdentity as any);
  }, []);
};
