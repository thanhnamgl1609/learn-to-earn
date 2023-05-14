import { Model, Sequelize, Op, ModelStatic } from 'sequelize';

export type IDBModel = typeof DBModel;

export type DB = {
  [k: string]: IDBModel;
} & {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  Op: typeof Op;
};

export class DBModel extends Model {
  static associate: (db: DB) => void;
}
