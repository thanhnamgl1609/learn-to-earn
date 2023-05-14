import { DB, DBModel } from '@_types/models';
import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  class CourseDuration extends DBModel {
    static associate(models: DB) {
      this.belongsTo(models.courses, {
        foreignKey: 'courseId',
      });
    }
  }
  CourseDuration.init(
    {
      theory: DataTypes.INTEGER,
      practice: DataTypes.INTEGER,
      exercise: DataTypes.INTEGER,
    },
    {
      sequelize,
      charset: 'utf8',
      modelName: 'course_durations',
      collate: 'utf8_unicode_ci',
    }
  );
  return CourseDuration;
};
