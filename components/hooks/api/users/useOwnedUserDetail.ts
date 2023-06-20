import { NftIdentity, RegistrationInfo } from '@_types/nftIdentity';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { selectUser, updateUser } from '@store/userSlice';
import CONST from 'config/constants.json';
import endpoints from 'config/endpoints.json';
import { makeRequest } from 'utils';
import { Route } from '@hooks/routes/config';
import { useApi } from '@hooks/common';
import { useRouter } from 'next/router';

type Params = {
  role?: number;
  roleType?: number;
  url?: Route;
  account?: string;
  nftIdentities?: NftIdentity[] | null;
  registrationInfos?: RegistrationInfo[] | null;
};

const { ROLES } = CONST;

export const useOwnedUserDetail = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { registrationInfos, nftIdentities } = useAppSelector(selectUser);

  const getDetail = async ({
    role: selectedRole,
    roleType,
    account,
    nftIdentities: _nftIdentities,
    registrationInfos: _registrationInfos,
  }: Omit<Params, 'url'>) => {
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
    }: Params) => {
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
