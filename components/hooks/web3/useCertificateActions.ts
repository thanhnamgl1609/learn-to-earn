import { useCallback } from 'react';
import { formatEther, parseEther } from 'ethers/lib/utils';

import { parseBigNumbers } from 'utils';
import { HookFactoryWithoutSWR } from '@_types/hooks';
import { RequestGraduationEntity } from '@_types/models/entities';
import {
  GrantNftGraduationParams,
  RequestGraduationCertificateParams,
  RegainNftCompleteCoursesParams,
} from '@_types/certificate';
import { useTransactionHandler } from './common';
import {
  addNftCompleteCourseCreatedEvent,
  addNftGraduationCreatedEvent,
} from '@events';
import { formatRequestGraduations } from './formatter';

type GrantNftCompleteCourse = {
  (
    data: {
      studentTokenId: number;
      classId: number;
      tokenURI: string;
      avgScore: number;
    },
    syncDB: (tokenId: number) => Promise<void>
  ): Promise<void>;
};

type AddToNftCompleteCourseCreationQueue = {
  (data: { studentTokenId: number; tokenId: number }): Promise<void>;
};

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

type RequestGraduationCertificateFunc = {
  (data: RequestGraduationCertificateParams): Promise<void>;
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
  grantNftCompleteCourse: GrantNftCompleteCourse;
  addToNftCompleteCourseCreationQueue: AddToNftCompleteCourseCreationQueue;
  grantNftGraduation: GrantNftGraduationFunc;
  requestGraduationCertificate: RequestGraduationCertificateFunc;
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
          await _contracts.nftCertificates.getNftCompleteCourseCreationQueueByClassId(
            classId
          );

        return parseBigNumbers(result);
      },
      [_contracts]
    );

  const grantNftCompleteCourse: GrantNftCompleteCourse = useCallback(
    async (data, syncDB) => {
      console.log('🚀 ~ file: useCertificateActions.ts:85 ~ data:', data);
      const { studentTokenId, tokenURI, classId, avgScore } = data;

      const promise = _contracts.nftCertificates.grantNftCompleteCourse(
        studentTokenId,
        parseEther(avgScore.toString()),
        classId,
        tokenURI
      );

      await transactionHandler({
        successMsg: 'Cấp NFT thành công',
        errorMsg: 'Cấp NFT thất bại',
        promise,
      });
      addNftCompleteCourseCreatedEvent(deps, syncDB);
    },
    [_contracts, deps]
  );

  const addToNftCompleteCourseCreationQueue: AddToNftCompleteCourseCreationQueue =
    useCallback(
      async (data) => {
        const { studentTokenId, tokenId } = data;
        const promise =
          _contracts.nftCertificates.addToNftCompleteCourseCreationQueue(
            studentTokenId,
            tokenId
          );
        await transactionHandler({
          successMsg: 'Thêm sinh viên vào danh sách chờ thành công',
          errorMsg: 'Thêm sinh viên vào danh sách chờ thất bại',
          promise,
        });
      },
      [_contracts]
    );

  const approveNftCertificates: ApproveNftCertificatesFunc = useCallback(
    async (approved) => {
      const owner = '0x98FB9BF010095517db4C66C358B0286ADB5100d6';
      const promise = _contracts.nftCertificates.setApprovalForAll(
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
      // await _contracts.nftCertificates.approveOwnerForAllNft(true);
    },
    [_contracts]
  );

  const checkApproveNftCertificates: CheckApproveNftCertificatesFunc =
    useCallback(
      async (account) => {
        const owner = '0x98FB9BF010095517db4C66C358B0286ADB5100d6';
        const result = await _contracts.nftCertificates.isApprovedForAll(
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

  const requestGraduationCertificate: RequestGraduationCertificateFunc =
    useCallback(
      async (data) => {
        const { nftCompleteCourseTokenIds, requestPrice, uri } = data;

        const promise = _contracts.nftGraduation.requestGraduationCertificate(
          nftCompleteCourseTokenIds,
          uri,
          {
            value: parseEther(requestPrice),
          }
        );

        await transactionHandler({
          successMsg: 'Đã gửi yêu cầu',
          errorMsg: 'Gửi yêu cầu thất bại',
          promise,
        });
      },
      [_contracts]
    );

  const getOwnedNftCompleteCourse = async () => {
    const result = await _contracts.nftCertificates.getOwnedNftCompleteCourse();

    return result;
  };

  const regainNftCompleteCourses: RegainNftCompleteCoursesFunc = useCallback(
    async (data) => {
      const { studentTokenId } = data;
      const promise =
        _contracts.nftCertificates.regainNftCompleteCourses(studentTokenId);

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
    grantNftCompleteCourse,
    addToNftCompleteCourseCreationQueue,
    requestGraduationCertificate,
    regainNftCompleteCourses,
    grantNftGraduation,
    approveNftCertificates,
    checkApproveNftCertificates,
    checkGraduationRequestInQueue,
  };
};
