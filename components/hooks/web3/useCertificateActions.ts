import { useCallback } from 'react';
import { formatEther } from 'ethers/lib/utils';

import { parseBigNumbers } from 'utils';
import { HookFactoryWithoutSWR } from '@_types/hooks';
import {
  ExchangeNftCompleteCourseParams,
  GrantNftGraduationParams,
  RegainNftCompleteCoursesParams,
  AllowRequestNftCompleteCourseParams,
} from '@_types/certificate';
import { useTransactionHandler } from './common';
import {
  addNftCompleteCourseCreatedEvent,
  addNftGraduationCreatedEvent,
} from '@events';
import { ENV } from '@config/env';

type GetRequestGraduationPriceFunc = {
  (): Promise<string>;
};

type GetNftCompleteCourseForRequestGraduationFunc = {
  ({ studentTokenId }: { studentTokenId: number }): Promise<any>;
};

type GetNftCompleteCourseCreationCreationQueue = {
  (classId: number): Promise<number[]>;
};

type GrantNftGraduationFunc = {
  (
    data: GrantNftGraduationParams,
    onSuccess: (tokenId: number) => Promise<void>
  ): Promise<void>;
};

type AllowRequestNftCompleteCourseFunc = {
  (data: AllowRequestNftCompleteCourseParams): Promise<void>;
};

type ExchangeNftCompleteCourseFunc = {
  (
    data: ExchangeNftCompleteCourseParams,
    syncDB: (tokenId: number) => Promise<void>
  ): Promise<void>;
};

type RegainNftCompleteCoursesFunc = {
  (data: RegainNftCompleteCoursesParams): Promise<void>;
};

type ApproveNftCertificatesFunc = {
  (data: boolean): Promise<void>;
};

type CheckApproveNftCertificatesFunc = {
  (account: string): Promise<boolean>;
};

type CheckGraduationRequestInQueueFunc = {
  (studentTokenId: number): Promise<boolean>;
};

type UseCertificateActionsReturnTypes = {
  getRequestGraduationPrice: GetRequestGraduationPriceFunc;
  getNftCompleteCourseForRequestGraduation: GetNftCompleteCourseForRequestGraduationFunc;
  getNftCompleteCourseCreationCreationQueue: GetNftCompleteCourseCreationCreationQueue;
  allowRequestNftCompleteCourse: AllowRequestNftCompleteCourseFunc;
  exchangeNftCompleteCourse: ExchangeNftCompleteCourseFunc;
  grantNftGraduation: GrantNftGraduationFunc;
  regainNftCompleteCourses: RegainNftCompleteCoursesFunc;
  approveNftCertificates: ApproveNftCertificatesFunc;
  checkApproveNftCertificates: CheckApproveNftCertificatesFunc;
  checkGraduationRequestInQueue: CheckGraduationRequestInQueueFunc;
};

type SchoolActionsHookFactory =
  HookFactoryWithoutSWR<UseCertificateActionsReturnTypes>;

export type UseCertificateActionsHook = ReturnType<SchoolActionsHookFactory>;

export const hookFactory: SchoolActionsHookFactory = (deps) => () => {
  const { contracts: _contracts } = deps;
  const transactionHandler = useTransactionHandler();

  const getRequestGraduationPrice: GetRequestGraduationPriceFunc =
    useCallback(async () => {
      const result =
        await _contracts.nftGraduation.requestGraduationCertificatePrice();

      return formatEther(result);
    }, []);

  const getNftCompleteCourseForRequestGraduation: GetNftCompleteCourseForRequestGraduationFunc =
    useCallback(async ({ studentTokenId }) => {
      const result =
        await _contracts.nftGraduation.getNftCompleteCourseForRequestGraduation(
          studentTokenId
        );

      return result;
    }, []);

  const getNftCompleteCourseCreationCreationQueue: GetNftCompleteCourseCreationCreationQueue =
    useCallback(
      async (classId: number) => {
        const result =
          await _contracts.nftCompleteCourses.getNftCompleteCourseCreationQueueByClassId(
            classId
          );

        return parseBigNumbers(result);
      },
      [_contracts]
    );

  const allowRequestNftCompleteCourse: AllowRequestNftCompleteCourseFunc =
    useCallback(
      async (data) => {
        const { tokenId, isAllowed } = data;
        const promise =
          _contracts.nftClassRegistration.allowRequestNftCompleteCourse(
            tokenId,
            isAllowed
          );

        await transactionHandler({
          pendingMsg: 'Đang xử lí...',
          successMsg: 'Cho đổi trao đổi NFT hoàn tất môn thành công!',
          errorMsg: 'Cho đổi trao đổi NFT hoàn tất môn thất bại!',
          promise,
        });
      },
      [deps]
    );

  const exchangeNftCompleteCourse: ExchangeNftCompleteCourseFunc = useCallback(
    async (data, syncDB) => {
      const { tokenURI, nftClassRegistrationTokenId } = data;

      const promise = _contracts.nftCompleteCourses.exchangeNftCompleteCourse(
        nftClassRegistrationTokenId,
        tokenURI
      );

      await transactionHandler({
        pendingMsg: 'Đang xử lí...',
        successMsg: 'Đổi NFT thành công!',
        errorMsg: 'Đổi NFT thất bại!',
        promise,
      });
      addNftCompleteCourseCreatedEvent(deps, syncDB);
    },
    [deps]
  );

  const approveNftCertificates: ApproveNftCertificatesFunc = useCallback(
    async (approved) => {
      const owner = ENV.OWNER;
      const promise = _contracts.nftCompleteCourses.setApprovalForAll(
        owner,
        approved
      );
      await transactionHandler({
        pendingMsg: 'Cho phép giáo vụ chuyển đổi NFT hoàn tất môn học...',
        successMsg:
          'Thành công khi cho phép giáo vụ chuyển đổi NFT hoàn tất môn học',
        errorMsg:
          'Thất bại khi cho phép giáo vụ chuyển đổi NFT hoàn tất môn học',
        promise,
      });
      // await _contracts.nftCompleteCourses.approveOwnerForAllNft(true);
    },
    [_contracts]
  );

  const checkApproveNftCertificates: CheckApproveNftCertificatesFunc =
    useCallback(
      async (account) => {
        const owner = ENV.OWNER;
        const result = await _contracts.nftCompleteCourses.isApprovedForAll(
          account,
          owner
        );

        return result;
      },
      [_contracts]
    );

  const checkGraduationRequestInQueue: CheckGraduationRequestInQueueFunc =
    useCallback(
      async (studentTokenId) => {
        const isInQueue = await _contracts.nftGraduation.checkRequestInQueue(
          studentTokenId
        );

        return isInQueue;
      },
      [_contracts]
    );

  const getOwnedNftCompleteCourse = async () => {
    const result =
      await _contracts.nftCompleteCourses.getOwnedNftCompleteCourse();

    return result;
  };

  const regainNftCompleteCourses: RegainNftCompleteCoursesFunc = useCallback(
    async (data) => {
      const { studentTokenId } = data;
      const promise =
        _contracts.nftCompleteCourses.regainNftCompleteCourses(studentTokenId);

      await transactionHandler({
        successMsg: 'Đã thu hồi NFT',
        errorMsg: 'Thu hồi thất bại',
        promise,
      });
    },
    [_contracts]
  );

  const grantNftGraduation: GrantNftGraduationFunc = useCallback(
    async (data, onSuccess) => {
      const { studentTokenId, tokenURI } = data;
      const promise = _contracts.nftGraduation.grantNftGraduation(
        studentTokenId,
        tokenURI
      );

      await transactionHandler({
        successMsg: 'Cấp NFT tốt nghiệp thành công',
        errorMsg: 'Cấp NFT tốt nghiệp thất bại',
        promise,
      });
      addNftGraduationCreatedEvent(_contracts, onSuccess);
    },
    [_contracts]
  );

  return {
    getRequestGraduationPrice,
    getOwnedNftCompleteCourse,
    getNftCompleteCourseForRequestGraduation,
    getNftCompleteCourseCreationCreationQueue,
    allowRequestNftCompleteCourse,
    exchangeNftCompleteCourse,
    regainNftCompleteCourses,
    grantNftGraduation,
    approveNftCertificates,
    checkApproveNftCertificates,
    checkGraduationRequestInQueue,
  };
};
