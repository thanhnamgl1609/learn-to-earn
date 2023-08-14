import { FC } from 'react';

import CONST from 'config/constants.json';
import {
  KnowledgeBlockEntity,
  NftCompleteCourseEntity,
  NftGraduationEntity,
} from '@_types/models/entities';
import { NftCompleteCourseDetail } from '@templates/NftCompleteCourseDetail';
import { NftGraduationDetail } from '@templates/NftGraduationDetail';

type DisplayNFTProps = {
  knowledgeBlocks: KnowledgeBlockEntity[];
  response: NftGraduationEntity | NftCompleteCourseEntity;
  type: number;
};

const { NFT_TYPE_KEYS } = CONST;

export const DisplayNFT: FC<DisplayNFTProps> = ({
  knowledgeBlocks,
  response,
  type,
}) => {
  if (!response) return null;

  switch (type) {
    case NFT_TYPE_KEYS.NFT_COMPLETE_COURSE:
      return (
        <NftCompleteCourseDetail
          nftCompleteCourse={response as NftCompleteCourseEntity}
        />
      );
    case NFT_TYPE_KEYS.NFT_GRADUATION:
      return (
        <NftGraduationDetail
          knowledgeBlocks={knowledgeBlocks}
          nftGraduation={response as NftGraduationEntity}
        />
      );
    default:
      return null;
  }
};
