import { ChangeEvent, useCallback, useState } from 'react';

import CONST from 'config/constants.json';
import { SearchBar } from '@molecules';
import { BaseLayout, DisplayNFT } from '@templates';
import { useFormSubmit, useInputTextChange } from '@hooks/form';
import { Button, Select } from '@atoms';
import { useSearchNFT } from '@hooks/common';
import {
  NftCompleteCourseEntity,
  NftGraduationEntity,
} from '@_types/models/entities';
import { useKnowledgeBlockListApi } from '@hooks/api/knowledge-blocks';

const { NFT_TYPE_KEYS } = CONST;

const NFT_TYPES = [
  {
    label: 'NFT hoàn thành môn học',
    value: NFT_TYPE_KEYS.NFT_COMPLETE_COURSE,
  },
  {
    label: 'NFT tốt nghiệp',
    value: NFT_TYPE_KEYS.NFT_GRADUATION,
  },
];

const PLACE_HOLDER = {
  [NFT_TYPE_KEYS.NFT_COMPLETE_COURSE]: 'Nhập token ID',
  [NFT_TYPE_KEYS.NFT_GRADUATION]: 'Nhập token ID',
};

const SearchPage = () => {
  const { data: knowledgeBlocks = [] } = useKnowledgeBlockListApi();
  const handleSearchNFT = useSearchNFT();
  const [searchNFT, setSearchNFT] = useState({
    type: String(NFT_TYPE_KEYS.NFT_GRADUATION),
    tokenId: null,
  });
  const [response, setResponse] = useState<{
    data: NftGraduationEntity | NftCompleteCourseEntity | null;
    type: number;
  }>({ data: null, type: NFT_TYPE_KEYS.NFT_GRADUATION });
  const submit = async () => {
    if (searchNFT.tokenId) {
      const result = await handleSearchNFT(searchNFT);
      setResponse({
        data: result || null,
        type: parseInt(searchNFT.type),
      });
    }
  };
  const onSubmit = useFormSubmit(submit, [searchNFT]);
  const onTypeChange = useInputTextChange(setSearchNFT);
  const onTokenIdChange = useInputTextChange(setSearchNFT);

  return (
    <BaseLayout>
      <form onSubmit={onSubmit} className="flex gap-4">
        <Select
          name="type"
          options={NFT_TYPES}
          value={searchNFT.type}
          onChange={onTypeChange}
        />
        <SearchBar
          className="flex-1"
          placeholder={
            PLACE_HOLDER[searchNFT.type] || 'Nhập token Id...'
          }
          value={searchNFT.tokenId}
          name="tokenId"
          onChange={onTokenIdChange}
        />
        <Button theme="main" type="submit">
          Tìm kiếm
        </Button>
      </form>
      <DisplayNFT knowledgeBlocks={knowledgeBlocks} response={response.data} type={response.type} />
    </BaseLayout>
  );
};

export default SearchPage;
