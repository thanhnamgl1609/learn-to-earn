import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { NftIdentityMetaType } from '@_types/nftIdentity';
import { logger } from 'utils';
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

  return useCallback(async (data: NftIdentityMetaType & { role: number }) => {
    const { role, ...nftMetadata } = data;
    if (!nftMetaValidator(nftMetadata)) return;
    dispatch(loading());

    try {
      const link = await dispatch(
        uploadData({
          data: { ...data, target: UPLOAD_TARGET.CREATE_COURSE },
          getSignedData,
        })
      ).unwrap();
      await registerNftIdentity(role, link);
      const { isOwner, ...newUserInfo } = await mutate();
      dispatch(
        updateUser({
          roleType: CONST.ROLES.REGISTERED,
          role: role,
          afterUpdate: () =>
            router.push(
              Routes.registerDetail.name.replace(
                ':role',
                ROLE_LABELS[role].toLowerCase()
              )
            ),
          ...newUserInfo,
        })
      );

      return link;
    } catch (e) {
      logger(e, { method: 'error' });
      toast.error(ERROR_MESSAGE.UNEXPECTED);
    } finally {
      dispatch(unloading());
    }
  }, []);
};
