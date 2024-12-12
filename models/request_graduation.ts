import { DB, DBModel } from '@_types/models';
import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  class RequestGraduations extends DBModel {
    static associate(models: DB) {
      this.hasMany(models.nft_complete_course_graduation_relations, {
        foreignKey: 'requestGraduationId',
        sourceKey: 'id',
        as: 'nftCompleteCourseGraduationRelations',
      });
      this.belongsTo(models.users, {
        foreignKey: 'studentTokenId',
        targetKey: 'tokenId',
        as: 'student',
      });
    }
  }
  RequestGraduations.init(
    {
      requestDate: DataTypes.STRING,
      nationalDefenseEduCertificate: DataTypes.STRING,
      foreignLanguageCertificate: DataTypes.STRING,
      otherCertificates: DataTypes.JSON,
      status: {
        type: DataTypes.NUMBER,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: 'request_graduations',
      tableName: 'request_graduations',
      // paranoid: true,
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    }
  );
  return RequestGraduations;
};
