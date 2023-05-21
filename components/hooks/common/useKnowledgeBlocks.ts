import CONST from 'config/constants.json';

const { KNOWLEDGE_BLOCKS } = CONST;

export const useKnowledgeBlocks = () => {
  const knowledgeBlockOptions = [
    { value: 0, label: 'Không có' },
    ...Object.values(KNOWLEDGE_BLOCKS).map(({ id, name }) => ({
      value: id,
      label: name,
    })),
  ];

  return { knowledgeBlockOptions };
};
