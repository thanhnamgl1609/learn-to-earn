import { useCallback } from 'react';
import { ethers } from 'ethers';

import { addNftClassRegistrationCreatedEvent } from '@events';
import { HookFactoryWithoutSWR } from '@_types/hooks';
import { NftIdentity } from '@_types/nftIdentity';
import { formatNftIdentities } from './formatter';
import { SignatureData } from '@_types/common';
import { useTransactionHandler } from './common';
import { logger } from 'utils';

type GetStudentListOfClass = {
  (tokenId: number): Promise<NftIdentity[]>;
};

type GetNumberOfStudentsOfClass = {
  (tokenId: number): Promise<number>;
};

type RegisterClassFunc = {
  (
    classId: number,
    registerFee: number,
    uri: string,
    options: {
      signatureData: SignatureData;
      metadata: Record<string, any>;
    }
  ): Promise<void>;
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

export const hookFactory: SchoolActionsHookFactory = (deps) => () => {
  const { contracts: _contracts } = deps;
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
    async (classId, registerFee, link, { signatureData, metadata }) => {
      const promise = _contracts.nftClassRegistration.registerClass(
        classId,
        link,
        {
          value: ethers.utils.parseEther(registerFee.toString()),
        }
      );
      try {
        await transactionHandler({
          successMsg: `Success to register class`,
          errorMsg: `Fail to grant NFT`,
          promise,
        });
      } catch (e) {
        logger(e);
        throw { customError: 'Bạn đã đăng ký khóa học này rồi!' };
      }

      addNftClassRegistrationCreatedEvent(deps, { signatureData, metadata });
    },
    [_contracts, deps]
  );

  return {
    getStudentListOfClass,
    getNumberOfStudentsOfClass,
    registerClass,
  };
};
