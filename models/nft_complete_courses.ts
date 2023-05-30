import { DB, DBModel } from '@_types/models';
import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  class NftCompleteCourses extends DBModel {
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
  NftCompleteCourses.init(
    {
      tokenId: DataTypes.INTEGER,
      avgScore: DataTypes.FLOAT,
      chainURI: DataTypes.STRING,
      grantDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'nft_complete_courses',
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    }
  );
  return NftCompleteCourses;
};
