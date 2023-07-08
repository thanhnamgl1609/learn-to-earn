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
    options: {
      signatureData: SignatureData;
      metadata: Record<string, any>;
    }
  ): Promise<void>;
};

type ApproveToTeacherFunc = {
  (teacher: string, tokenId: number): Promise<void>;
};

type GetApprovalOfTokenIdFunc = {
  (tokenId: number): Promise<string>;
};

type GetRegisteredClassFunc = {
  (): Promise<any>;
};

type RegainNftClassRegistrationFunc = {
  (tokenId: number): Promise<void>;
};

type GetRegainedNftListOfClass = {
  (classId: number): Promise<number[]>;
};

type GetNftClassRegistration = {
  (tokenId: number): Promise<NftclassregistrationResponse>;
};

type CheckNftClassRegistrationRegainedFunc = {
  (studentTokenId: number, classId: number): Promise<boolean>;
};

type UseNftClassRegistrationActionsReturnTypes = {
  getStudentListOfClass: GetStudentListOfClass;
  getNumberOfStudentsOfClass: GetNumberOfStudentsOfClass;
  getRegainedNftListOfClass: GetRegainedNftListOfClass;
  getNftClassRegistration: GetNftClassRegistration;
  registerClass: RegisterClassFunc;
  approveToTeacher: ApproveToTeacherFunc;
  getApprovalOfTokenId: GetApprovalOfTokenIdFunc;
  getRegisteredClass: GetRegisteredClassFunc;
  regainNftClassRegistration: RegainNftClassRegistrationFunc;
  checkNftClassRegistrationRegained: CheckNftClassRegistrationRegainedFunc;
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

  const getRegainedNftListOfClass: GetRegainedNftListOfClass = useCallback(
    async (classId) => {
      const result =
        await _contracts!.nftClassRegistration.getRegainedNftListOfClass(
          classId
        );

      return parseBigNumbers(result);
    },
    [_contracts]
  );

  const getRegisteredClass: GetRegisteredClassFunc = useCallback(async () => {
    const result = await _contracts!.nftClassRegistration.getRegistereClasses();

    return result;
  }, [_contracts]);

  const getApprovalOfTokenId: GetApprovalOfTokenIdFunc = useCallback(
    async (tokenId: number) => {
      const result = await _contracts.nftClassRegistration.getApproved(tokenId);

      return result;
    },
    [_contracts]
  );

  const getNftClassRegistration: GetNftClassRegistration = useCallback(
    async (tokenId: number) => {
      const result =
        await _contracts.nftClassRegistration.getNftClassRegistration(tokenId);
      return result;
    },
    [_contracts]
  );

  const checkNftClassRegistrationRegained: CheckNftClassRegistrationRegainedFunc =
    useCallback(
      async (studentTokenId, classId) => {
        const result =
          await _contracts.nftClassRegistration.checkNftClassRegistrationRegained(
            studentTokenId,
            classId
          );

        return result;
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
          successMsg: 'Đăng ký thành công',
          errorMsg: 'Đăng ký thất bại',
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

  const approveToTeacher: ApproveToTeacherFunc = useCallback(
    async (teacher: string, tokenId: number) => {
      const promise = _contracts.nftClassRegistration.approve(teacher, tokenId);
      await transactionHandler({
        successMsg: 'Đã cho phép giảng viên có thể thay đổi NFT này',
        errorMsg: 'Gửi yêu cầu thất bại',
        promise,
      });
    },
    [_contracts]
  );

  const regainNftClassRegistration: RegainNftClassRegistrationFunc =
    useCallback(
      async (tokenId: number) => {
        const promise = _contracts.nftClassRegistration.regainNft(tokenId);

        await transactionHandler({
          successMsg: 'Đã thu hồi NFT đăng ký khóa học',
          errorMsg: 'Thu hồi NFT đăng ký khóa học thất bại',
          promise,
        });
      },
      [_contracts]
    );

  return {
    getStudentListOfClass,
    getNumberOfStudentsOfClass,
    getRegainedNftListOfClass,
    getApprovalOfTokenId,
    getNftClassRegistration,
    getRegisteredClass,
    checkNftClassRegistrationRegained,
    registerClass,
    approveToTeacher,
    regainNftClassRegistration,
  };
};
