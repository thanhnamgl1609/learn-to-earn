import CONST from 'config/constants.json';
import { useCertificateActions } from '@hooks/web3';
import { useApi } from './useApi';
import {
  NftCompleteCourseEntity,
  NftGraduationEntity,
} from '@_types/models/entities';

const { NFT_TYPE_KEYS } = CONST;

export const useSearchNFT = () => {
  const { getNftCompleteCourse, getNftGraduation } =
    useCertificateActions();

  const result = useApi<
    NftGraduationEntity | NftCompleteCourseEntity,
    { tokenId: string; type: string }
  >(({ tokenId, type }) => {
    const intTokenId = parseInt(tokenId);
    switch (parseInt(type)) {
      case NFT_TYPE_KEYS.NFT_GRADUATION:
        return getNftGraduation(intTokenId);
      case NFT_TYPE_KEYS.NFT_COMPLETE_COURSE:
        return getNftCompleteCourse(intTokenId);
    }
  }, []);

  return result;
};
