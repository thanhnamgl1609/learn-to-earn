import { useApi } from './useApi';
import {
  useIdentitiesActions,
  useNftClassRegistrationActions,
} from '@hooks/web3';
import { NftClassRegistrationEntity } from '@_types/models/entities';

export const useRequestCompleteCourseCertificate = () => {
  const { getOwnerOfTokenId } = useIdentitiesActions();
  const { approveToTeacher } = useNftClassRegistrationActions();

  return useApi(async (data: NftClassRegistrationEntity) => {
    const { tokenId, class: classInfo } = data;
    const teacherAddress = await getOwnerOfTokenId(classInfo.teacherTokenId);
    await approveToTeacher(teacherAddress, tokenId);
  }, []);
};
