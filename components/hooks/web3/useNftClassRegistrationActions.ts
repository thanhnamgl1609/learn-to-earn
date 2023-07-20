import { useCallback } from 'react';
import { ethers } from 'ethers';

import { addNftClassRegistrationCreatedEvent } from '@events';
import { HookFactoryWithoutSWR } from '@_types/hooks';
import { NftIdentity } from '@_types/nftIdentity';
import { formatNftIdentities } from './formatter';
import { SignatureData } from '@_types/common';
import { useTransactionHandler } from './common';
import { logger, parseBigNumbers } from 'utils';
import { NftclassregistrationResponse } from '@_types/contracts/NftClassRegistration';

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
    syncDB: (tokenId: number) => Promise<void>
  ): Promise<void>;
};

type ApproveToTeacherFunc = {
  (teacher: string, tokenId: number): Promise<void>;
};

type GetApprovalOfTokenIdFunc = {
  (tokenId: number): Promise<string>;
};

type GetRegainedNftListOfClass = {
  (classId: number): Promise<number[]>;
};

type GetNftClassRegistration = {
  (tokenId: number): Promise<NftclassregistrationResponse>;
};

type UseNftClassRegistrationActionsReturnTypes = {
  getStudentListOfClass: GetStudentListOfClass;
  getNumberOfStudentsOfClass: GetNumberOfStudentsOfClass;
  getNftClassRegistration: GetNftClassRegistration;
  registerClass: RegisterClassFunc;
  approveToTeacher: ApproveToTeacherFunc;
  getApprovalOfTokenId: GetApprovalOfTokenIdFunc;
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

  const getNumberOfStudentsOfClass: GetNumberOfStudentsOfClass =
    useCallback(
      async (classTokenId) => {
        const result =
          await _contracts!.nftClassRegistration.getNumberOfRegisteredStudent(
            classTokenId
          );

        return result.toNumber();
      },
      [_contracts]
    );

  const getApprovalOfTokenId: GetApprovalOfTokenIdFunc = useCallback(
    async (tokenId: number) => {
      const result =
        await _contracts.nftClassRegistration.getApproved(tokenId);

      return result;
    },
    [_contracts]
  );

  const getNftClassRegistration: GetNftClassRegistration =
    useCallback(
      async (tokenId: number) => {
        const result =
          await _contracts.nftClassRegistration.getNftClassRegistration(
            tokenId
          );
        return result;
      },
      [_contracts]
    );

  const registerClass: RegisterClassFunc = useCallback(
    async (classId, registerFee, link, syncDB) => {
      const promise = _contracts.nftClassRegistration.registerClass(
        classId,
        link,
        {
          value: ethers.utils.parseEther(registerFee.toString()),
        }
      );
      await transactionHandler({
        successMsg: 'Đăng ký thành công',
        errorMsg: 'Đăng ký thất bại',
        promise,
      });

      addNftClassRegistrationCreatedEvent(deps, syncDB);
    },
    [_contracts, deps]
  );

  const approveToTeacher: ApproveToTeacherFunc = useCallback(
    async (teacher: string, tokenId: number) => {
      const promise = _contracts.nftClassRegistration.approve(
        teacher,
        tokenId
      );
      await transactionHandler({
        successMsg: 'Đã cho phép giảng viên có thể thay đổi NFT này',
        errorMsg: 'Gửi yêu cầu thất bại',
        promise,
      });
    },
    [_contracts]
  );

  return {
    getStudentListOfClass,
    getNumberOfStudentsOfClass,
    getApprovalOfTokenId,
    getNftClassRegistration,
    registerClass,
    approveToTeacher,
  };
};
