import _ from 'lodash';

import CONST from '@config/constants.json';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import {
  useNftClassRegistrationActions,
  useUtilities,
} from '@hooks/web3';
import { uploadData } from '@store/actions';
import { selectUser } from '@store/userSlice';
import endpoints from 'config/endpoints.json';
import { useApi } from './useApi';
import { ClassEntity } from '@_types/models/entities';
import { classEntity, courseEntity, userEntity } from 'domain/models';
import { logger, makeRequest } from 'utils';
import { toast } from 'react-toastify';
import { useMe } from '@hooks/api';

const { ROLES, UPLOAD_TARGET } = CONST;

export const useRegisterClass = () => {
  const { registerClass } = useNftClassRegistrationActions();
  const { getSignedData } = useUtilities();
  const fetchMe = useMe();
  const dispatch = useAppDispatch();
  const { nftIdentities, account } = useAppSelector(selectUser);

  const _syncDB =
    ({ signature, metadata }) =>
    async (id: number) => {
      try {
        await makeRequest({
          method: 'POST',
          data: {
            signature,
            address: account,
            data: { id, metadata },
          },
        })([endpoints.registerClasses]);
        await fetchMe();
      } catch (e) {
        logger(e);
        toast.error('Đồng bộ thất bại');
      }
    };

  return useApi(
    async (item: ClassEntity) => {
      const nftIdentity = nftIdentities.find(
        ({ role }) => role === ROLES.STUDENT
      );

      const metadata = {
        registerFee: classEntity.displayRegisterFee(
          item.registerClassFee
        ),
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
        registerFee: item.registerClassFee,
        target: UPLOAD_TARGET.REGISTER_CLASS,
      };

      const signature = await getSignedData();
      const { link, meta } = await dispatch(
        uploadData({
          data,
          signature,
          successText:
            'Upload metadata cho NFT đăng ký lớp học thành công!',
        })
      ).unwrap();

      await registerClass(
        item.onChainId,
        item.registerClassFee,
        link,
        _syncDB({
          metadata: {
            ...meta,
            registerFee: item.registerClassFee,
            owner: {
              tokenId: nftIdentity.tokenId,
              ...nftIdentity.meta,
            },
          },
          signature,
        })
      );
    },
    [nftIdentities]
  );
};
