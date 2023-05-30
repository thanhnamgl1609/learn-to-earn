import { Transaction } from 'sequelize';
import db from 'models';
import { KnowledgeBlockEntity } from '@_types/models/entities';

export const getAll = async (
  transaction?: Transaction
): Promise<KnowledgeBlockEntity[]> => {
  const result = await db.knowledge_blocks.findAll({
    attributes: ['id', 'onChainId', 'name', 'credits'],
    transaction,
  });

  return result.map((item) => item.get());
};
