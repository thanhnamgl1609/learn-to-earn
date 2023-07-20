import { useRouter } from 'next/router';
import ROUTES from 'config/routes.json';

import { ClassEntity } from '@_types/models/entities';
import { useValidator } from '@hooks/form';
import { useAppSelector } from '@hooks/stores';
import { useUtilities } from '@hooks/web3';
import { useSyncRequestGraduationDetail } from '@hooks/api';
import { selectUser } from '@store/userSlice';
import { REQUEST_NFT_GRADUATION } from '@validators/schemas';
import { useApi } from '../../common/useApi';

type FormData = {
  classEntities: ClassEntity[];
  nationalDefenseEduCertificate: string;
  foreignLanguageCertificate: string;
  requestPrice: string;
  otherCertificates: string[];
};

export const useRequestGraduationCertificate = () => {
  const router = useRouter();
  const { detail } = useAppSelector(selectUser);
  const validator = useValidator(REQUEST_NFT_GRADUATION);
  const { getSignedData } = useUtilities();
  const syncDB = useSyncRequestGraduationDetail();

  return useApi(
    async (formData: FormData) => {
      const { ..._data } = formData;
      const { tokenId: studentTokenId } = detail;
      const data = validator(_data as any) as Omit<
        FormData,
        'requestPrice'
      >;
      if (!data) return;

      const { classEntities, ...otherData } = _data;
      const nftCompleteCourseTokenIds = classEntities.map(
        ({ nftCompleteCourses }) => nftCompleteCourses[0].tokenId
      );
      const signature = await getSignedData();

      await syncDB({
        signature,
        data: {
          ...otherData,
          nftCompleteCourseTokenIds,
          studentTokenId,
        },
      });
      router.push(ROUTES.myRequestGraduation.name);
    },
    [detail]
  );
};
