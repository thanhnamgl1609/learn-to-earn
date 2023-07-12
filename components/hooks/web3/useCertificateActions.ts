import { useCallback } from 'react';

import { HookFactoryWithoutSWR } from '@_types/hooks';
import {
  ExchangeNftCompleteCourseParams,
  GrantNftGraduationParams,
  AllowRequestNftCompleteCourseParams,
} from '@_types/certificate';
import { useTransactionHandler } from './common';
import {
  addNftCompleteCourseCreatedEvent,
  addNftGraduationCreatedEvent,
} from '@events';

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

type UseCertificateActionsReturnTypes = {
  allowRequestNftCompleteCourse: AllowRequestNftCompleteCourseFunc;
  exchangeNftCompleteCourse: ExchangeNftCompleteCourseFunc;
  grantNftGraduation: GrantNftGraduationFunc;
};

type SchoolActionsHookFactory =
  HookFactoryWithoutSWR<UseCertificateActionsReturnTypes>;

export type UseCertificateActionsHook =
  ReturnType<SchoolActionsHookFactory>;

export const hookFactory: SchoolActionsHookFactory = (deps) => () => {
  const { contracts: _contracts } = deps;
  const transactionHandler = useTransactionHandler();

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

  const exchangeNftCompleteCourse: ExchangeNftCompleteCourseFunc =
    useCallback(
      async (data, syncDB) => {
        const { tokenURI, nftClassRegistrationTokenId } = data;

        const promise =
          _contracts.nftCompleteCourses.exchangeNftCompleteCourse(
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

  const getOwnedNftCompleteCourse = async () => {
    const result =
      await _contracts.nftCompleteCourses.getOwnedNftCompleteCourse();

    return result;
  };

  const grantNftGraduation: GrantNftGraduationFunc = useCallback(
    async (data, onSuccess) => {
      const { tokenIds, tokenURI } = data;
      const promise = _contracts.nftGraduation.grantNftGraduation(
        tokenIds,
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
    getOwnedNftCompleteCourse,
    allowRequestNftCompleteCourse,
    exchangeNftCompleteCourse,
    grantNftGraduation,
  };
};
