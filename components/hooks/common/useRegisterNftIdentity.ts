import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { NftIdentityMetaType, RegistrationInfoMeta } from '@_types/nftIdentity';
import { logger, makeRequest, request } from 'utils';
import CONST from '@config/constants.json';
import ERROR_MESSAGE from '@config/error-message.json';
import { uploadData } from '@store/actions';
import { loading, unloading } from '@store/appSlice';
import Routes from '@config/routes.json';
import { useAppDispatch } from '@hooks/stores';
import { useRegistrationActions, useUserInfo, useUtilities } from '@hooks/web3';
import { useValidator } from '@hooks/form';
import { APPLY_VALIDATOR } from '@validators/schemas';
import { updateUser } from '@store/userSlice';

const { ROLE_LABELS, UPLOAD_TARGET } = CONST;

export const useRegisterNftIdentity = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    userInfo: { mutate },
  } = useUserInfo();
  const { getSignedData } = useUtilities();
  const { registerNftIdentity } = useRegistrationActions();
  const nftMetaValidator = useValidator(APPLY_VALIDATOR);

  return useCallback(
    async (
      data: Omit<
        RegistrationInfoMeta,
        'memberCode' | 'email' | 'dateOfBirth' | 'registerDate'
      > & {
        role: number;
        dateOfBirth: string;
      }
    ) => {
      const { role, ...nftMetadata } = data;
      if (!nftMetaValidator(nftMetadata as any)) return;
      dispatch(loading());

      try {
        const { link } = await dispatch(
          uploadData({
            data: { ...data, target: UPLOAD_TARGET.REGISTRATION },
            getSignedData,
            successText:
              'Your profile is uploaded! Please wait for sending request!',
          })
        ).unwrap();
        await registerNftIdentity(role, link);
        const { isOwner, ...newUserInfo } = await mutate();
        dispatch(
          updateUser({
            roleType: CONST.ROLES.REGISTERED,
            role: role,
            ...newUserInfo,
            afterUpdate: () =>
              router.push(
                Routes.registerDetail.name.replace(
                  ':role',
                  ROLE_LABELS[role].toLowerCase()
                )
              ),
          })
        );

        dispatch(unloading());
        return link;
      } catch (e) {
        logger(e, { method: 'error' });
        dispatch(unloading());
        toast.error(ERROR_MESSAGE.UNEXPECTED);
      }
    },
    []
  );
};
