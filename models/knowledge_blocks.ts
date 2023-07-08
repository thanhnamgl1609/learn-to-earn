import { DB, DBModel } from '@_types/models';
import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  class KnowledgeBlocks extends DBModel {
    static associate(models: DB) {
      this.hasMany(models.classes, {
        foreignKey: 'knowledgeBlockId',
        sourceKey: 'id',
      });
    }
  }
  KnowledgeBlocks.init(
    {
      onChainId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      credits: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'knowledge_blocks',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    }
  );
  return KnowledgeBlocks;
};
