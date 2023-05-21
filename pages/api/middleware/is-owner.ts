import { Session } from 'next-iron-session';
import { NextApiRequest, NextApiResponse } from 'next';
import { ENV } from '@config/env';
import { createError } from '@api/utils/create-error';

export default async (
  req: NextApiRequest & { session: Session },
  response: NextApiResponse
) => {
  return new Promise(async (resolve, reject) => {
    const { address } = req.body;

    if (address === ENV.OWNER) {
      return resolve('Correct address');
    } else {
      return reject(createError(400, 'message is empty'));
    }
  });
};
