import { useRouter } from 'next/router';

import { RegistrationInfo } from '@_types/nftIdentity';
import CONST from 'config/constants.json';
import ROUTES from 'config/routes.json';
import { useAccount, useRegistrationActions, useUtilities } from '@hooks/web3';
import { uploadData } from '@store/actions';
import { useAppDispatch } from '@hooks/stores';
import { makeRequest } from 'utils';
import endpoints from 'config/endpoints.json';
import { useApi } from './useApi';

const { UPLOAD_TARGET } = CONST;

export const useGrantNftIdentity = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { getSignedData } = useUtilities();
  const { grantNftIdentity } = useRegistrationActions();
  const {
    account: { data: account },
  } = useAccount();

  return useApi(
    async (nftIdentity: RegistrationInfo & { expiredAt: string }) => {
      const { applicant, role, expiredAt, documentURI, meta } = nftIdentity;
      const metadata = {
        ...meta,
        registerURI: documentURI,
      };

      const signature = await getSignedData();
      const { link, meta: uploadMeta } = await dispatch(
        uploadData({
          data: { role, ...metadata, target: UPLOAD_TARGET.APPLY_REGISTRATION },
          signature,
          successText: 'Upload metadata thành công! Đang cấp NFT định danh...',
        })
      ).unwrap();
      await grantNftIdentity({
        applicant,
        role,
        expiredAt,
        documentURI: link,
      });
      await makeRequest({
        method: 'POST',
        data: {
          address: account,
          data: {
            ...nftIdentity,
            tokenURI: link,
            meta: {
              ...metadata,
              ...uploadMeta,
            },
          },
          signature,
        },
        options: {
          timeout: 20000,
        },
      })([endpoints.userDetail]);

      router.push(ROUTES.manageRegistration.name + `?r=${role}`);
    },
    [account]
  );
};
