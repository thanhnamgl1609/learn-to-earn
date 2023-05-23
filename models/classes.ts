import { DB, DBModel } from '@_types/models';
import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Classes extends DBModel {
    static associate(models: DB) {
      this.belongsTo(models.courses, {
        foreignKey: 'courseCode',
        targetKey: 'courseCode',
      });
      this.belongsTo(models.users, {
        foreignKey: 'teacherTokenId',
        targetKey: 'tokenId',
        as: 'teacher',
      });
    }
  }
  Classes.init(
    {
      onChainId: DataTypes.INTEGER,
      semesterId: DataTypes.INTEGER,
      knowledgeBlockId: DataTypes.INTEGER,
      credits: DataTypes.INTEGER,
      startAt: DataTypes.DATE,
      completeAt: DataTypes.DATE,
      maxSize: DataTypes.INTEGER,
      chainURI: DataTypes.STRING,
      numberOfStudents: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'classes',
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    }
  );
  return Classes;
};
