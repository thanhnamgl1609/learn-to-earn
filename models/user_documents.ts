import { DB, DBModel } from '@_types/models';
import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  class UserDocuments extends DBModel {
    static associate(models: DB) {
      this.belongsTo(models.users, {
        targetKey: 'id',
        onDelete: 'CASCADE',
      });
    }
  }
  UserDocuments.init(
    {
      uri: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'user_documents',
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    }
  );
  return UserDocuments;
};
