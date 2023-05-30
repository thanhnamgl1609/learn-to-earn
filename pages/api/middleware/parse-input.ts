import zod from 'zod';
import { Session } from 'next-iron-session';
import { NextApiRequest, NextApiResponse } from 'next';
import { createError } from '@api/utils/create-error';
import { getError } from '@validators/zod';

export default <D>(schema: zod.ZodType<D>) =>
  async (
    req: NextApiRequest & { session: Session },
    response: NextApiResponse
  ) => {
    return new Promise(async (resolve, reject) => {
      const { data } = req.body;
      console.log("🚀 ~ file: parse-input.ts:14 ~ returnnewPromise ~ data:", data)

      try {
        req.body.data = schema.parse(data);
        resolve('valid');
      } catch (e) {
        reject(createError(400, getError(e)));
      }
    });
  };
