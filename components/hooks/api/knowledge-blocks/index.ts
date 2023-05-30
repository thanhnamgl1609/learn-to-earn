export { useKnowledgeBlockListApi } from './useKnowledgeBlockList';

import { getKnowledgeBlockList } from './useKnowledgeBlockList';

export const useKnowledgeBlockActions = () => ({
  getKnowledgeBlockList,
});
