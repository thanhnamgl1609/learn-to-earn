import { useAppDispatch, useAppSelector } from '@hooks/stores';
import {
  selectCurrentNftIdentity,
  selectCurrentRegistration,
  selectUser,
  updateUser,
} from '@store/userSlice';
import CONST from 'config/constants.json';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils';
import { useApi } from '@hooks/common';
import { useRouter } from 'next/router';

const { ROLES } = CONST;

export const useUserDetail = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { registrationInfos, nftIdentities } = useAppSelector(selectUser);

  const getDetail = async ({
    role: selectedRole,
    roleType,
    account,
    nftIdentities: _nftIdentities,
    registrationInfos: _registrationInfos,
  }) => {
    let url = endpoints.userDetail;
    let params = {};

    switch (roleType) {
      case ROLES.COUNCIL:
        params = { account };
        break;
      case ROLES.STUDENT:
      case ROLES.TEACHER:
        const currentNftIdentity = (_nftIdentities ?? nftIdentities).find(
          ({ role }) => role === selectedRole
        );
        params = {
          tokenId: currentNftIdentity.tokenId,
        };
        break;
      default:
        return {
          detail: null,
          nftIdentities: _nftIdentities ?? nftIdentities,
          registrationInfos: _registrationInfos ?? registrationInfos,
        };
    }

    const detail = await makeRequest()([url, params]);

    return {
      detail,
      nftIdentities: _nftIdentities ?? nftIdentities,
      registrationInfos: _registrationInfos ?? registrationInfos,
    };
  };

  return useApi(
    async ({
      role,
      roleType,
      url: targetUrl,
      account,
      nftIdentities = null,
      registrationInfos = null,
    }) => {
      const response = await getDetail({
        role,
        roleType,
        account,
        nftIdentities,
        registrationInfos,
      });

      const afterUpdate = () => router.push(targetUrl.name, targetUrl.as);
      dispatch(
        updateUser({
          account: account,
          ...response,
          role,
          roleType,
          afterUpdate: roleType === ROLES.COUNCIL ? null : afterUpdate,
        })
      );
    },
    [nftIdentities, registrationInfos]
  );
};
