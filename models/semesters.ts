import { DB, DBModel } from '@_types/models';
import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Semesters extends DBModel {
    static associate(models: DB) {
      this.hasMany(models.user_documents, {
        foreignKey: 'userId',
        as: 'documentURIs',
      });
    }
  }
  Semesters.init(
    {
      startYear: DataTypes.INTEGER,
      endYear: DataTypes.INTEGER,
      semester: DataTypes.INTEGER,
      startAt: DataTypes.DATE,
      endAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'semesters',
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    }
  );
  return Semesters;
};
