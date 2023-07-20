import { DB, DBModel } from '@_types/models';
import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Courses extends DBModel {
    static associate(models: DB) {
      this.belongsTo(models.courses, {
        foreignKey: 'prevCourseId',
        as: 'prevCourse',
      });
      this.belongsTo(models.knowledge_blocks, {
        foreignKey: 'knowledgeBlockId',
        targetKey: 'onChainId',
        as: 'knowledgeBlock',
      });
    }
  }
  Courses.init(
    {
      onChainId: DataTypes.INTEGER,
      knowledgeBlockId: DataTypes.INTEGER,
      courseCode: DataTypes.STRING(8),
      name: DataTypes.STRING,
      credits: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      theoryLessons: DataTypes.INTEGER,
      practiceLessons: DataTypes.INTEGER,
      exerciseLessons: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      isRequired: DataTypes.INTEGER,
      chainURI: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'courses',
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    }
  );
  return Courses;
};
