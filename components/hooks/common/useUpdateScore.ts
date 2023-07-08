import { useApi } from './useApi';
import { useCertificateActions, useIdentitiesActions } from '@hooks/web3';
import { UpdateScoreParams } from '@_types/certificate';
import { useUpdateScoreForNftClassRegistration } from '@hooks/api/nft-complete-courses';

export const useUpdateScore = () => {
  const { allowRequestNftCompleteCourse } = useCertificateActions();
  const updateScoreForNftClassRegistration =
    useUpdateScoreForNftClassRegistration();

  return useApi(async (data: UpdateScoreParams) => {
    const { nftClassRegistration, score } = data;
    const { tokenId } = nftClassRegistration;
    await allowRequestNftCompleteCourse({ tokenId, isAllowed: score >= 5 });

    await updateScoreForNftClassRegistration({ tokenId, score });
  }, []);
};
