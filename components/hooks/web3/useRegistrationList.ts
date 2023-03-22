import { CryptoHookFactory } from '@_types/hooks';
import { RegistrationInfo, RegistrationInfoMeta } from '@_types/nftIdentity';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { ethers } from 'ethers';

type UseRegistrationListResponse = {
  grantNftIdentity: (addr: string) => Promise<void>;
};

type RegistrationList = {
  applications: RegistrationInfo[];
};

export type UseRegistrationListParams = {
  role: number;
};

type RegistrationListHookFactory = CryptoHookFactory<
  RegistrationList,
  UseRegistrationListResponse,
  UseRegistrationListParams
>;

export type UseRegistrationListHook = ReturnType<RegistrationListHookFactory>;

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
          await contracts!.nftIdentities.getAllNftIdentityRegistration(role);
        const applicationsPromises = applicationsRes.map(
          async (applicationRes) => {
            const applicationMetadata = (await fetch(
              applicationRes.documentURI
            ).then((res) => res.json())) as RegistrationInfoMeta;

            return {
              ...applicationRes,
              meta: applicationMetadata,
            };
          }
        );
        const applications = await Promise.all(applicationsPromises);

        return { applications };
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
