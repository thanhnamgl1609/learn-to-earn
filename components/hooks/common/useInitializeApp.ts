import { useKnowledgeBlockActions } from '@hooks/api/knowledge-blocks';
import { useAppDispatch } from '@hooks/stores';
import { updateState } from '@store/appSlice';
import { updateSchool } from '@store/schoolSlice';
import { useCallback } from 'react';

export const useInitializeApp = () => {
  const { getKnowledgeBlockList } = useKnowledgeBlockActions();
  const dispatch = useAppDispatch();

  const _getKnowledgeBlockList = async () => {
    const knowledgeBlocks = await getKnowledgeBlockList();
    dispatch(updateSchool(knowledgeBlocks));
  };

  return useCallback(async () => {
    await _getKnowledgeBlockList();
    dispatch(updateState({ isInitialize: true }));
  }, []);
};
