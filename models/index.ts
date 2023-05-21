import fs from 'fs';
import path from 'path';
import { Sequelize, Op, Dialect } from 'sequelize';

import { DB, DBModel, IDBModel } from '@_types/models';
import DB_CONFIG from 'config/database';

const modelFolder = path.join(process.cwd(), 'models');
const { username, database, password, dialect, ...options } = DB_CONFIG;

const sequelize = new Sequelize(
  DB_CONFIG.database,
  DB_CONFIG.username,
  DB_CONFIG.password,
  {
    ...options,
    dialect: dialect as Dialect,
  }
);

const db = {
  sequelize,
  Sequelize,
  Op,
} as DB;

const getModel = async () => {
  const files = fs
    .readdirSync(modelFolder)
    .filter(
      (file) =>
        file.indexOf('.') !== 0 &&
        file !== 'index.ts' &&
        file.slice(-3) === '.ts'
    );
  for (const file of files) {
    const module = await import(`./${file}`);
    const model = module.default(sequelize) as IDBModel;
    db[model.name] = model;
  }

  Object.keys(db).forEach((modelName) => {
    if (['sequelize', 'Sequelize', 'Op'].some((key) => key === modelName))
      return;
    (db[modelName] as typeof DBModel).associate?.(db);
  });
};

getModel();

export default db;
