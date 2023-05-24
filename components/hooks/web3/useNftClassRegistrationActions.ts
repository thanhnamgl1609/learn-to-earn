import { useCallback } from 'react';
import { ethers } from 'ethers';

import { HookFactoryWithoutSWR } from '@_types/hooks';
import { formatNftIdentities } from './formatter';
import { NftIdentity } from '@_types/nftIdentity';
import { useTransactionHandler } from './common';

type GetStudentListOfClass = {
  (tokenId: number): Promise<NftIdentity[]>;
};

type GetNumberOfStudentsOfClass = {
  (tokenId: number): Promise<number>;
};

type RegisterClassFunc = {
  (classId: number, registerFee: number, uri: string): Promise<void>;
};

type UseNftClassRegistrationActionsReturnTypes = {
  getStudentListOfClass: GetStudentListOfClass;
  getNumberOfStudentsOfClass: GetNumberOfStudentsOfClass;
  registerClass: RegisterClassFunc;
};

type SchoolActionsHookFactory =
  HookFactoryWithoutSWR<UseNftClassRegistrationActionsReturnTypes>;

export type UseNftClassRegistrationActionsHook =
  ReturnType<SchoolActionsHookFactory>;

export const hookFactory: SchoolActionsHookFactory =
  ({ contracts }) =>
  () => {
    const _contracts = contracts;
    const transactionHandler = useTransactionHandler();

    const getStudentListOfClass: GetStudentListOfClass = useCallback(
      async (classTokenId) => {
        const nftIdentities =
          await _contracts!.nftClassRegistration.getStudentListOfClass(
            classTokenId
          );
        const result = await formatNftIdentities(nftIdentities);

        return result;
      },
      [_contracts]
    );

    const getNumberOfStudentsOfClass: GetNumberOfStudentsOfClass = useCallback(
      async (classTokenId) => {
        const result =
          await _contracts!.nftClassRegistration.getNumberOfRegisteredStudent(
            classTokenId
          );

        return result.toNumber();
      },
      [_contracts]
    );

    const registerClass: RegisterClassFunc = useCallback(
      async (classId, registerFee, link) => {
        const promise = _contracts.nftClassRegistration.registerClass(
          classId,
          link,
          {
            value: ethers.utils.formatEther(registerFee),
          }
        );
        await transactionHandler({
          successMsg: `Success to register class`,
          errorMsg: `Fail to grant NFT`,
          promise,
        });
      },
      [_contracts]
    );

    return {
      getStudentListOfClass,
      getNumberOfStudentsOfClass,
      registerClass,
    };
  };
