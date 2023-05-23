import { DB, DBModel } from '@_types/models';
import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Users extends DBModel {
    static associate(models: DB) {
      this.hasMany(models.user_documents, {
        foreignKey: 'userId',
        as: 'documentURIs',
      });
      this.hasMany(models.classes, {
        foreignKey: 'teacherTokenId',
        sourceKey: 'tokenId',
        as: 'teacher',
      });
    }
  }
  Users.init(
    {
      profileImage: DataTypes.STRING,
      tokenId: DataTypes.INTEGER,
      memberCode: DataTypes.STRING,
      fullName: DataTypes.STRING,
      gender: DataTypes.INTEGER,
      dateOfBirth: DataTypes.DATE,
      email: DataTypes.STRING,
      personalEmail: DataTypes.STRING,
      identityNumber: DataTypes.STRING,
      phone: DataTypes.STRING(10),
      role: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      registerAddress: DataTypes.STRING,
      expiredAt: DataTypes.DATE,
      chainURI: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'users',
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    }
  );
  return Users;
};
