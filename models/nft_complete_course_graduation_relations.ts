import { DB, DBModel } from '@_types/models';
import { Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class NftCompleteCourseGraduationRelations extends DBModel {
    static associate(models: DB) {
      this.belongsTo(models.nft_complete_courses, {
        foreignKey: 'nftCompleteCourseTokenId',
        targetKey: 'tokenId',
        as: 'nftCompleteCourse'
      });
      this.belongsTo(models.nft_graduations, {
        foreignKey: 'nftGraduationId',
        targetKey: 'tokenId',
      });
      this.belongsTo(models.request_graduations, {
        foreignKey: 'requestGraduationId',
        targetKey: 'id',
      });
    }
  }
  NftCompleteCourseGraduationRelations.init(
    {},
    {
      sequelize,
      modelName: 'nft_complete_course_graduation_relations',
      tableName: 'nft_complete_course_graduation_relations',
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    }
  );
  return NftCompleteCourseGraduationRelations;
};
