import CONST from 'config/constants.json';
import { useCertificateActions, useUtilities } from '@hooks/web3';
import { uploadData } from '@store/actions';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { useApi } from './useApi';
import { classEntity, courseEntity, userEntity } from 'domain/models';
import {
  CreatedNftCompleteCourse,
  ExchangeNftCompleteCourseBodyData,
} from '@_types/api/certificates';
import { SignatureData } from '@_types/common';
import { NftClassRegistrationEntityWithApproveStatus } from '@_types/api/class';
import { ExchangeNftCompleteCourseParams } from '@_types/certificate';
import { selectCurrentNftIdentity, selectUser } from '@store/userSlice';
import { useSyncCreatedNftCompleteCourse } from '@hooks/api/nft-complete-courses';

const { UPLOAD_TARGET } = CONST;

export const useExchangeNftCompleteCourse = () => {
  const dispatch = useAppDispatch();
  const { tokenId: studentTokenId } = useAppSelector(selectCurrentNftIdentity);
  const { account } = useAppSelector(selectUser);
  const { getSignedData } = useUtilities();
  const { exchangeNftCompleteCourse } = useCertificateActions();
  const syncDB = useSyncCreatedNftCompleteCourse();

  const _exchangeNftClassRegistration = async (
    { nftClassRegistrationTokenId, tokenURI }: ExchangeNftCompleteCourseParams,
    meta: Pick<CreatedNftCompleteCourse, 'grantDate'>,
    { signature }: SignatureData
  ) => {
    await exchangeNftCompleteCourse(
      {
        nftClassRegistrationTokenId,
        tokenURI,
      },
      (tokenId) =>
        syncDB(
          {
            nftClassRegistrationTokenId,
            tokenId,
            studentTokenId,
            tokenURI,
            ...meta,
          },
          { signature, address: account }
        )
    );
  };

  return useApi(
    async (
      nftClassRegistration: NftClassRegistrationEntityWithApproveStatus
    ) => {
      const { class: classInfo, student, score } = nftClassRegistration;
      const { course } = classInfo;

      const signature = await getSignedData();
      const { link: tokenURI, meta } = await dispatch(
        uploadData({
          data: {
            classInfo: classEntity.displayPublic(classInfo),
            course: courseEntity.displayPublic(course),
            teacher: userEntity.displayPublic(classInfo.teacher),
            student: userEntity.displayPublic(student),
            score,
            target: UPLOAD_TARGET.GRANT_NFT_COMPLETE_COURSE,
          },
          signature,
          successText: 'Metadata đã được upload! Đang gửi yêu cầu...!',
        })
      ).unwrap();
      await _exchangeNftClassRegistration(
        {
          nftClassRegistrationTokenId: nftClassRegistration.tokenId,
          tokenURI,
        },
        meta as Pick<ExchangeNftCompleteCourseBodyData, 'grantDate'>,
        { signature }
      );
    },
    [account, studentTokenId]
  );
};
