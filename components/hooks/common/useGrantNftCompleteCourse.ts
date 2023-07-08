import CONST from 'config/constants.json';
import {
  useAccount,
  useCertificateActions,
  useNftClassRegistrationActions,
  useUtilities,
} from '@hooks/web3';
import { uploadData } from '@store/actions';
import { useAppDispatch } from '@hooks/stores';
import { logger, makeRequest } from 'utils';
import endpoints from 'config/endpoints.json';
import { useApi } from './useApi';
import { classEntity, courseEntity, userEntity } from 'domain/models';
import {
  CreatedNftCompleteCourse,
  GrantNftCompleteCourseParams,
} from '@_types/api/certificates';
import { SignatureData } from '@_types/common';
import { NftClassRegistrationEntityWithApproveStatus } from '@_types/api/class';
import { useValidator } from '@hooks/form';
import { GRANT_NFT_COMPLETE_COURSE } from '@validators/schemas';

const { UPLOAD_TARGET } = CONST;

export const useGrantNftCompleteCourse = () => {
  const dispatch = useAppDispatch();
  const { getSignedData } = useUtilities();
  const { regainNftClassRegistration } = useNftClassRegistrationActions();
  const { grantNftCompleteCourse, addToNftCompleteCourseCreationQueue } =
    useCertificateActions();
  const validator = useValidator(GRANT_NFT_COMPLETE_COURSE);
  const {
    account: { data: account },
  } = useAccount();

  const _syncDB = async (
    _data: CreatedNftCompleteCourse,
    { signature }: { signature: string }
  ) => {
    const data = {
      data: _data,
      signature,
      address: account,
    };

    await makeRequest({
      method: 'POST',
      data,
    })([endpoints.nftCompleteCourse]);
  };

  const _addToNftCompleteCourseCreationQueue = async (
    { studentTokenId, tokenId }: { studentTokenId: number; tokenId: number },
    isInQueue: boolean
  ) => {
    if (!isInQueue) {
      try {
        await addToNftCompleteCourseCreationQueue({ studentTokenId, tokenId });
      } catch (e) {
        logger('[FAIL] add to queue', { method: 'error' });
        throw e;
      }
    }
  };
  const _regainNftClassRegistration = async (
    tokenId: number,
    isRegained: boolean
  ) => {
    if (!isRegained) {
      try {
        await regainNftClassRegistration(tokenId);
      } catch (e) {
        logger('[FAIL] regain', { method: 'error' });
        throw e;
      }
    }
  };

  const _grantNftClassRegistration = async (
    {
      studentTokenId,
      avgScore,
      classId,
      tokenURI,
    }: GrantNftCompleteCourseParams,
    meta: Pick<CreatedNftCompleteCourse, 'grantDate'>,
    { signature }: SignatureData
  ) => {
    await grantNftCompleteCourse(
      {
        studentTokenId,
        avgScore,
        classId,
        tokenURI,
      },
      (tokenId) =>
        _syncDB(
          {
            tokenId,
            studentTokenId,
            avgScore,
            classId,
            tokenURI,
            ...meta,
          },
          { signature }
        )
    );
  };

  return useApi(
    async (
      nftClassRegistration: NftClassRegistrationEntityWithApproveStatus,
      _avgScore: string
    ) => {
      const data = validator({ avgScore: _avgScore });
      if (!data) return;
      const { avgScore } = data as { avgScore: number };

      const {
        tokenId,
        studentTokenId,
        class: classInfo,
        student,
      } = nftClassRegistration;
      const { course, onChainId: classId } = classInfo;

      await _addToNftCompleteCourseCreationQueue(
        { studentTokenId, tokenId },
        nftClassRegistration.isInQueue
      );
      await _regainNftClassRegistration(
        tokenId,
        nftClassRegistration.isRegained
      );
      const signature = await getSignedData();
      const { link: tokenURI, meta } = await dispatch(
        uploadData({
          data: {
            classInfo: classEntity.displayPublic(classInfo),
            course: courseEntity.displayPublic(course),
            teacher: userEntity.displayPublic(classInfo.teacher),
            student: userEntity.displayPublic(student),
            avgScore,
            target: UPLOAD_TARGET.GRANT_NFT_COMPLETE_COURSE,
          },
          signature,
          successText: 'Metadata đã được upload! Đang gửi yêu cầu...!',
        })
      ).unwrap();
      await _grantNftClassRegistration(
        {
          studentTokenId,
          avgScore,
          classId,
          tokenURI,
        },
        meta as Pick<CreatedNftCompleteCourse, 'grantDate'>,
        { signature }
      );
    },
    [account]
  );
};
