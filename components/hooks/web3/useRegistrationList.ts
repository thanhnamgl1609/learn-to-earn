import useSWR from 'swr';

import CONST from 'config/constants.json';
import { CryptoHookFactory } from '@_types/hooks';
import { RegistrationInfo } from '@_types/nftIdentity';
import { formatRegistrationInfos } from './formatter/registrationInfos';
import { useAppDispatch } from '@hooks/stores';
import { loading, unloading } from '@store/appSlice';

type UseRegistrationListResponse = {};

export type UseRegistrationListParams = {
  role: number;
};

type RegistrationListHookFactory = CryptoHookFactory<
  RegistrationInfo[],
  UseRegistrationListResponse,
  UseRegistrationListParams
>;

export type UseRegistrationListHook = ReturnType<RegistrationListHookFactory>;

const { ROLES } = CONST;
const AVAILABLE_ROLES = [ROLES.TEACHER, ROLES.STUDENT];

export const hookFactory: RegistrationListHookFactory =
  ({ contracts }) =>
  ({ role }) => {
    const dispatch = useAppDispatch();

    const { data, ...swr } = useSWR(
      contracts ? `web3/useRegistrationList/${role}` : null,
      async () => {
        dispatch(loading());
        if (AVAILABLE_ROLES.every((_role) => role !== _role)) return null;

        const applications =
          await contracts!.nftIdentities.getAllRegistrationInfosByRole(role);

        const result = await formatRegistrationInfos(applications, role);
        dispatch(unloading());

        return result;
      }
    );

    return {
      ...swr,
      data,
    };
  };
