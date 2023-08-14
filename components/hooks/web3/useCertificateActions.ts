import { useCallback } from 'react';

import { HookFactoryWithoutSWR } from '@_types/hooks';
import {
  ExchangeNftCompleteCourseParams,
  ExchangeNftGraduationParams,
  AllowRequestNftCompleteCourseParams,
  AllowRequestNftCompleteCoursesParams,
  SetExchangableNftGraduationParams,
} from '@_types/certificate';
import { useTransactionHandler } from './common';
import {
  addNftCompleteCourseCreatedEvent,
  addNftGraduationCreatedEvent,
} from '@events';
import {
  NftCompleteCourseEntity,
  NftGraduationEntity,
} from '@_types/models/entities';
import {
  formatNftCompleteCourse,
  formatNftGraduation,
} from './formatter/certificates';

type ExchangeNftGraduationFunc = {
  (
    data: ExchangeNftGraduationParams,
    onSuccess: (tokenId: number) => Promise<void>
  ): Promise<void>;
};

type SearchNFTFunc<ReturnType> = {
  (tokenId: number): Promise<ReturnType>;
};

type SetExchangableNftGraduationFunc = {
  (data: SetExchangableNftGraduationParams): Promise<void>;
};

type AllowRequestNftCompleteCourseFunc = {
  (data: AllowRequestNftCompleteCourseParams): Promise<void>;
};

type AllowRequestNftCompleteCoursesFunc = {
  (data: AllowRequestNftCompleteCoursesParams): Promise<void>;
};

type ExchangeNftCompleteCourseFunc = {
  (
    data: ExchangeNftCompleteCourseParams,
    syncDB: (tokenId: number) => Promise<void>
  ): Promise<void>;
};

type UseCertificateActionsReturnTypes = {
  allowRequestNftCompleteCourse: AllowRequestNftCompleteCourseFunc;
  allowRequestNftCompleteCourses: AllowRequestNftCompleteCoursesFunc;
  setExchangableNftGraduation: SetExchangableNftGraduationFunc;
  exchangeNftCompleteCourse: ExchangeNftCompleteCourseFunc;
  exchangeNftGraduation: ExchangeNftGraduationFunc;
  getNftCompleteCourse: SearchNFTFunc<NftCompleteCourseEntity>;
  getNftGraduation: SearchNFTFunc<NftGraduationEntity>;
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

  const allowRequestNftCompleteCourses: AllowRequestNftCompleteCoursesFunc =
    useCallback(
      async (data) => {
        const tokenIds = data.map(({ tokenId }) => tokenId);
        const allowLists = data.map(({ isAllowed }) => isAllowed);
        const promise =
          _contracts.nftClassRegistration.allowRequestNftCompleteCourses(
            tokenIds,
            allowLists
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

  const setExchangableNftGraduation: SetExchangableNftGraduationFunc =
    useCallback(
      async (data) => {
        const { studentTokenId, isAllowed } = data;
        const promise =
          _contracts.nftGraduation.setExchangableNftGraduation(
            studentTokenId,
            isAllowed
          );

        await transactionHandler({
          successMsg: isAllowed
            ? 'Cho phép sinh viên đỏi chứng chỉ tốt nghiệp'
            : 'Từ chối yêu cầu đổi chứng chỉ tốt nghiệp',
          errorMsg: 'Cập nhật thất bại',
          promise,
        });
      },
      [_contracts]
    );

  const exchangeNftGraduation: ExchangeNftGraduationFunc =
    useCallback(
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

  const getNftGraduation: SearchNFTFunc<NftGraduationEntity> =
    useCallback(async (studentTokenId) => {
      const { tokenId } =
        await _contracts.nftGraduation.getNftGraduationByTokenId(
          studentTokenId
        );
      const metadataURI = await _contracts.nftGraduation.tokenURI(
        tokenId
      );
      return formatNftGraduation({
        tokenId: tokenId.toNumber(),
        metadataURI,
      });
    }, []);

  const getNftCompleteCourse: SearchNFTFunc<NftCompleteCourseEntity> =
    useCallback(async (tokenId) => {
      await _contracts.nftCompleteCourses.getNftCompleteCourse(
        tokenId
      );
      const metadataURI = await _contracts.nftCompleteCourses.uri(
        tokenId
      );
      return formatNftCompleteCourse({
        tokenId,
        metadataURI,
      });
    }, []);

  return {
    getOwnedNftCompleteCourse,
    setExchangableNftGraduation,
    allowRequestNftCompleteCourse,
    allowRequestNftCompleteCourses,
    exchangeNftCompleteCourse,
    exchangeNftGraduation,
    getNftCompleteCourse,
    getNftGraduation,
  };
};
