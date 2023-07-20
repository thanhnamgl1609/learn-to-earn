import { useCallback } from 'react';

import CONST from 'config/constants.json';
import { useSyncCreatedNftGraduation } from '@hooks/api';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { useNftCompleteCourseListGetter } from '@hooks/api/classes';
import { useCertificateActions, useUtilities } from '@hooks/web3';
import { nftCompleteCourseEntity, userEntity } from 'domain/models';
import { selectUser, selectUserDetail } from '@store/userSlice';
import { uploadData } from '@store/actions';
import { useApi } from './useApi';
import { priceVO } from 'domain/models/value-objects';
import { RequestGraduationEntity } from '@_types/models/entities';

type Params = {
  request: RequestGraduationEntity;
};

const { UPLOAD_TARGET } = CONST;

export const useGrantNftGraduation = () => {
  const dispatch = useAppDispatch();
  const { account } = useAppSelector(selectUser);
  const student = useAppSelector(selectUserDetail);
  const { getSignedData } = useUtilities();
  const { exchangeNftGraduation } = useCertificateActions();
  const syncCreatedNftGraduation = useSyncCreatedNftGraduation();

  const _grantNftGraduation = useCallback(
    async (request: RequestGraduationEntity) => {
      const { nftCompleteCourses } = request;

      const {
        nationalDefenseEduCertificate,
        foreignLanguageCertificate,
        otherCertificates,
      } = request;
      const signature = await getSignedData();
      const {
        link: tokenURI,
        meta: { grantDate },
      } = await dispatch(
        uploadData({
          data: {
            nftCompleteCourses:
              nftCompleteCourseEntity.displayPublicList(
                nftCompleteCourses
              ),
            student: userEntity.displayPublic(student),
            nationalDefenseEduCertificate,
            foreignLanguageCertificate,
            otherCertificates,
            target: UPLOAD_TARGET.GRANT_NFT_GRADUATION,
          },
          signature,
          successText:
            'Metadata đã được upload! Đang gửi yêu cầu...!',
        })
      ).unwrap();

      const tokenIds = nftCompleteCourses.map(
        ({ tokenId }) => tokenId
      );
      const params = {
        tokenIds,
        tokenURI,
      };
      await exchangeNftGraduation(params, (tokenId) =>
        syncCreatedNftGraduation(
          {
            tokenId,
            studentTokenId: student.tokenId,
            grantDate,
            uri: tokenURI,
          },
          { signature, address: account }
        )
      );
    },
    [student]
  );

  return useApi(async ({ request }: Params) => {
    await _grantNftGraduation(request);
  });
};
