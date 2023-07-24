import { DB, DBModel } from '@_types/models';
import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  class NftGraduations extends DBModel {
    static associate(models: DB) {
      this.hasMany(models.nft_complete_course_graduation_relations, {
        foreignKey: 'nftGraduationId',
        sourceKey: 'tokenId',
        as: 'nftCompleteCourseGraduationRelations',
      });
      this.belongsTo(models.request_graduations, {
        foreignKey: 'requestGraduationId',
        targetKey: 'id',
        as: 'request',
      });
      this.belongsTo(models.users, {
        foreignKey: 'studentTokenId',
        targetKey: 'tokenId',
        as: 'student',
      });
    }
  }
  NftGraduations.init(
    {
      tokenId: DataTypes.INTEGER,
      grantDate: DataTypes.DATE,
      uri: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'nft_graduations',
      tableName: 'nft_graduations',
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    }
  );
  return NftGraduations;
};
