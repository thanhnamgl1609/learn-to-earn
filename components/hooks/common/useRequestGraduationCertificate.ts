import CONST from 'config/constants.json';
import { ClassEntity } from '@_types/models/entities';
import { useValidator } from '@hooks/form';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { useCertificateActions, useUtilities } from '@hooks/web3';
import { useSyncRequestGraduationDetail } from '@hooks/api';
import { uploadData } from '@store/actions';
import { selectUser } from '@store/userSlice';
import { REQUEST_NFT_GRADUATION } from '@validators/schemas';
import { priceVO } from 'domain/models/value-objects';
import { nftCompleteCourseEntity, userEntity } from 'domain/models';
import { useApi } from './useApi';

type FormData = {
  classEntities: ClassEntity[];
  nationalDefenseEduCertificate: string;
  foreignLanguageCertificate: string;
  requestPrice: string;
  otherCertificates: string[];
};

const { UPLOAD_TARGET } = CONST;

export const useRequestGraduationCertificate = () => {
  const dispatch = useAppDispatch();
  const { detail } = useAppSelector(selectUser);
  const validator = useValidator(REQUEST_NFT_GRADUATION);
  const { requestGraduationCertificate, approveNftCertificates } =
    useCertificateActions();
  const { getSignedData } = useUtilities();
  const syncDB = useSyncRequestGraduationDetail();

  return useApi(
    async (
      formData: FormData,
      currentStatus: { isInQueue: boolean; isApprovedSent: boolean }
    ) => {
      const { requestPrice, ..._data } = formData;
      const { tokenId: studentTokenId } = detail;
      const data = validator(_data as any) as Omit<FormData, 'requestPrice'>;
      if (!data) return;
      const { isInQueue, isApprovedSent } = currentStatus;

      if (!isApprovedSent) {
        await approveNftCertificates(true);
      }
      const { classEntities, ...otherData } = _data;
      const nftCompleteCourseTokenIds = classEntities.map(
        ({ nftCompleteCourses }) => nftCompleteCourses[0].tokenId
      );
      const nftCompleteCourses = classEntities.map(
        ({ nftCompleteCourses, ...classInfo }) => ({
          ...nftCompleteCourses[0],
          class: classInfo,
        })
      );

      if (!isInQueue) {
        const signature = await getSignedData();
        const uploadedData = {
          student: userEntity.displayPublic(detail),
          nftCompleteCourses:
            nftCompleteCourseEntity.displayPublicList(nftCompleteCourses),
          requestPrice: priceVO.displayPublic(requestPrice),
          target: UPLOAD_TARGET.REGISTER_CLASS,
        };
        const { link, meta } = await dispatch(
          uploadData({
            data: uploadedData,
            signature,
            successText:
              'Upload successfully! Please wait for sending request!',
          })
        ).unwrap();
        console.log("🚀 ~ file: useRequestGraduationCertificate.ts:68 ~ useRequestGraduationCertificate ~ meta:", meta)

        await requestGraduationCertificate({
          nftCompleteCourseTokenIds,
          requestPrice,
          uri: link,
        });
        await syncDB({
          signature,
          data: {
            ...otherData,
            nftCompleteCourseTokenIds,
            requestPrice,
            requestDate: meta.requestDate,
            studentTokenId,
            uri: link,
          },
        });
      }
    },
    [detail]
  );
};
