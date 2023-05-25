import _ from 'lodash';

import CONST from '@config/constants.json';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { useNftClassRegistrationActions, useUtilities } from '@hooks/web3';
import { uploadData } from '@store/actions';
import { selectUser } from '@store/userSlice';
import { useApi } from './useApi';
import { ClassEntity } from '@_types/models/entities';
import { classEntity, courseEntity, userEntity } from 'domain/models';

const { ROLES, UPLOAD_TARGET } = CONST;

export const useRegisterClass = () => {
  const { registerClass } = useNftClassRegistrationActions();
  const { getSignedData } = useUtilities();
  const dispatch = useAppDispatch();
  const { nftIdentities, account } = useAppSelector(selectUser);

  return useApi(
    async (item: ClassEntity) => {
      const nftIdentity = nftIdentities.find(
        ({ role }) => role === ROLES.STUDENT
      );

      const metadata = {
        classInfo: classEntity.displayPublic(item),
        course: courseEntity.displayPublic(item.course),
        teacher: userEntity.displayPublic(item.teacher),
        owner: {
          tokenId: nftIdentity.tokenId,
          ...nftIdentity.meta,
        },
      };

      const data = {
        ...metadata,
        target: UPLOAD_TARGET.REGISTER_CLASS,
      };

      const signature = await getSignedData();
      const { link } = await dispatch(
        uploadData({
          data,
          signature,
          successText: 'Upload successfully! Please wait for sending request!',
        })
      ).unwrap();

      await registerClass(item.onChainId, item.registerClassFee, link, {
        metadata,
        signatureData: {
          signature,
          account,
        },
      });
    },
    [nftIdentities]
  );
};
