import { CryptoHookFactory } from '@_types/hooks';
import { RegistrationInfo } from '@_types/nftIdentity';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import CONST from '@config/constants.json';
import { ethers } from 'ethers';

type UseRegistrationListResponse = {
  grantNftIdentity: (addr: string) => Promise<void>;
};

type RegistrationList = {
  applications: RegistrationInfo[];
};

type UseRegistrationListParams = {
  role: number;
};

type RegistrationListHookFactory = CryptoHookFactory<
  RegistrationList,
  UseRegistrationListResponse,
  UseRegistrationListParams
>;

export type UseRegistrationListHook = ReturnType<RegistrationListHookFactory>;

const { ROLES } = CONST;

export const hookFactory: RegistrationListHookFactory =
  ({ contracts }) =>
  ({ role }) => {
    const _contracts = contracts;
    const [applyTeacherFee, setApplyTeacherFee] = useState(
      ethers.BigNumber.from(0)
    );

    const { data, ...swr } = useSWR(
      contracts ? 'web3/useRegistrationList' : null,
      async () => {
        const applicationsRes =
          (await contracts!.nftIdentities.getAllNftIdentityRegistration(
            role
          ));

        return applicationsRes;
      }
    );

    const grantNftIdentity = useCallback(
      async (addr: string) => {},
      [_contracts, applyTeacherFee]
    );

    return {
      ...swr,
      data,
      grantNftIdentity,
    };
  };
