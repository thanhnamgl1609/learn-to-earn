import { useApi } from './useApi';
import { useCertificateActions } from '@hooks/web3';
import { useUpdateScoreForNftClassRegistrations } from '@hooks/api/nft-complete-courses';
import { NftClassRegistrationEntity } from '@_types/models/entities';
import { toast } from 'react-toastify';

export const useUpdateScores = () => {
  const { allowRequestNftCompleteCourses } = useCertificateActions();
  const updateScoreForNftClassRegistrations =
    useUpdateScoreForNftClassRegistrations();

  return useApi(
    async (
      nftClassRegistrations: NftClassRegistrationEntity[],
      { onSuccess }: { onSuccess: () => Promise<void> }
    ) => {
      const updateInfos = nftClassRegistrations.map(
        ({ tokenId, score }) => ({
          tokenId,
          isAllowed: score >= 5,
        })
      );
      await allowRequestNftCompleteCourses(updateInfos);

      await updateScoreForNftClassRegistrations(
        nftClassRegistrations
      );

      await onSuccess();
    },
    []
  );
};
