import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { NftIdentityMetaType } from '@_types/nftIdentity';
import CONST from '@config/constants.json';
import { uploadData } from '@store/actions';
import { loading, unloading } from '@store/appSlice';
import Routes from '@config/routes.json';
import { useAppDispatch } from '@hooks/stores';
import { useRegistrationActions, useUtilities } from '@hooks/web3';
import { useValidator } from '@hooks/form';
import { APPLY_VALIDATOR } from '@validators/schemas';

const { ROLE_LABELS } = CONST;

export const useRegisterNftIdentity = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { getSignedData } = useUtilities();
  const { registerNftIdentity } = useRegistrationActions();
  const nftMetaValidator = useValidator(APPLY_VALIDATOR);

  return useCallback(async (data: NftIdentityMetaType & { role: number }) => {
    const { role, ...nftMetadata } = data;
    if (!nftMetaValidator(nftMetadata)) return;
    dispatch(loading());

    const link = await dispatch(uploadData({ data, getSignedData })).unwrap();
    await registerNftIdentity(role, link);

    dispatch(unloading());
    router.push(Routes.registerDetail.name.replace(':role', ROLE_LABELS[role]));
    return link;
  }, []);
};
