import { CryptoHookFactory } from '@_types/hooks';
import { RegistrationInfo, RegistrationInfoMeta } from '@_types/nftIdentity';
import { useCallback, useState } from 'react';
import useSWR from 'swr';

type UseRegistrationListResponse = {
  grantNftIdentity: (addr: string) => Promise<void>;
};

export type UseRegistrationListParams = {
  role: number;
};

type RegistrationListHookFactory = CryptoHookFactory<
  RegistrationInfo[],
  UseRegistrationListResponse,
  UseRegistrationListParams
>;

export type UseRegistrationListHook = ReturnType<RegistrationListHookFactory>;

export const hookFactory: RegistrationListHookFactory =
  ({ contracts }) =>
  ({ role }) => {
    const _contracts = contracts;

    const { data, ...swr } = useSWR(
      contracts ? 'web3/useRegistrationList' : null,
      async () => {
        const applicationsRes =
          await contracts!.nftIdentities.getAllNftIdentityRegistration(role);
          console.log("🚀 ~ file: useRegistrationList.ts:37 ~ role:", role)
        console.log("🚀 ~ file: useRegistrationList.ts:36 ~ applicationsRes:", applicationsRes)
        const applicationsPromises = applicationsRes.map(
          async ({ documentURI, applicant }) => {
            const applicationMetadata = (await fetch(
              documentURI
            ).then((res) => res.json())) as RegistrationInfoMeta;

            return {
              documentURI,
              applicant,
              meta: applicationMetadata,
            };
          }
        );
        const applications = await Promise.all(applicationsPromises);

        return applications;
      },
    );

    const grantNftIdentity = useCallback(
      async (addr: string) => {},
      [_contracts]
    );

    return {
      ...swr,
      data,
      grantNftIdentity,
    };
  };
