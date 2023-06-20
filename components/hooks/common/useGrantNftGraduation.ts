import { useCallback } from 'react';

import CONST from 'config/constants.json';
import { useValidator } from '@hooks/form';
import { useSyncCreatedNftGraduation, useUserDetail } from '@hooks/api';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { useNftCompleteCourseListGetter } from '@hooks/api/classes';
import { useCertificateActions, useUtilities } from '@hooks/web3';
import { GRANT_GRADUATION } from '@validators/schemas';
import { nftCompleteCourseEntity, userEntity } from 'domain/models';
import { selectUser } from '@store/userSlice';
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
  const { getSignedData } = useUtilities();
  const { regainNftCompleteCourses, grantNftGraduation } =
    useCertificateActions();
  const syncCreatedNftGraduation = useSyncCreatedNftGraduation();
  const getNftCompleteCourses = useNftCompleteCourseListGetter();
  const getUser = useUserDetail();

  const _regainNftGraduation = useCallback(
    (studentTokenId: number) => regainNftCompleteCourses({ studentTokenId }),
    []
  );

  const _grantNftGraduation = useCallback(
    async (request: RequestGraduationEntity) => {
      const { studentTokenId, nftCompleteCourseTokenIds } = request;

      const nftCompleteCourses = await getNftCompleteCourses({
        nftCompleteCourseTokenIds,
      });
      const student = await getUser({ tokenId: studentTokenId });

      const {
        requestPrice,
        uri: requestURI,
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
              nftCompleteCourseEntity.displayPublicList(nftCompleteCourses),
            student: userEntity.displayPublic(student),
            requestPrice: priceVO.displayPublic(requestPrice),
            requestURI,
            nationalDefenseEduCertificate,
            foreignLanguageCertificate,
            otherCertificates,
            target: UPLOAD_TARGET.GRANT_NFT_GRADUATION,
          },
          signature,
          successText: 'Metadata đã được upload! Đang gửi yêu cầu...!',
        })
      ).unwrap();

      const params = {
        studentTokenId,
        tokenURI,
      };
      grantNftGraduation(params, (tokenId) =>
        syncCreatedNftGraduation(
          {
            tokenId,
            studentTokenId,
            grantDate,
            uri: tokenURI,
          },
          { signature, address: account }
        )
      );
    },
    []
  );

  return useApi(async ({ request }: Params) => {
    await _regainNftGraduation(request.studentTokenId);
    await _grantNftGraduation(request);
  });
};
