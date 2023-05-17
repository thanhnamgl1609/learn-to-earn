import { Transaction } from 'sequelize';
import db from 'models';

export const withTransaction = <D>(
  cb: (t: Transaction) => Promise<D>,
  transaction?: Transaction
) => (transaction ? cb(transaction) : db.sequelize.transaction(cb));
