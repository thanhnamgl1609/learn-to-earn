import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-iron-session';

import { classesRepo } from 'domain/repositories';
import REQUEST_CONST from '@config/request.json';
import { withSession } from '../utils';
import { logger } from 'utils';

const { METHOD } = REQUEST_CONST;

export default withSession(
  async (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse<any>
  ) => {
    if (req.method === METHOD.GET) {
      try {
        const result = await classesRepo.getAll();

        return res.status(200).json(result);
      } catch (e) {
        logger(e);
        return res.status(422).json({ message: 'cannot create json' });
      }
    }
  }
);
