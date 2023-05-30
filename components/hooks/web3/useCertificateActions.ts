import { useCallback } from 'react';

import { HookFactoryWithoutSWR } from '@_types/hooks';
import { useTransactionHandler } from './common';
import { addNftCompleteCourseCreatedEvent } from '@events';
import { parseBigNumbers } from 'utils';
import { parseEther } from 'ethers/lib/utils';

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

type GetNftCompleteCourseCreationCreationQueue = {
  (classId: number): Promise<number[]>;
};

type UseCertificateActionsReturnTypes = {
  getNftCompleteCourseCreationCreationQueue: GetNftCompleteCourseCreationCreationQueue;
  grantNftCompleteCourse: GrantNftCompleteCourse;
  addToNftCompleteCourseCreationQueue: AddToNftCompleteCourseCreationQueue;
};

type SchoolActionsHookFactory =
  HookFactoryWithoutSWR<UseCertificateActionsReturnTypes>;

export type UseCertificateActionsHook = ReturnType<SchoolActionsHookFactory>;

export const hookFactory: SchoolActionsHookFactory = (deps) => () => {
  const { contracts: _contracts } = deps;
  const transactionHandler = useTransactionHandler();

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
    useCallback(async (data) => {
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
    }, []);

  return {
    getNftCompleteCourseCreationCreationQueue,
    grantNftCompleteCourse,
    addToNftCompleteCourseCreationQueue,
  };
};
