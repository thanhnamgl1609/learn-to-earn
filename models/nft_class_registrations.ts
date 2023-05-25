import { DB, DBModel } from '@_types/models';
import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  class NftClassRegistrations extends DBModel {
    static associate(models: DB) {
      this.belongsTo(models.classes, {
        foreignKey: 'classId',
        targetKey: 'onChainId',
      });
      this.belongsTo(models.users, {
        foreignKey: 'studentTokenId',
        targetKey: 'tokenId',
        as: 'student',
      });
    }
  }
  NftClassRegistrations.init(
    {
      tokenId: DataTypes.INTEGER,
      chainURI: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'nft_class_registrations',
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    }
  );
  return NftClassRegistrations;
};
