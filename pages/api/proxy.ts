import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-iron-session';

import REQUEST_CONST from '@config/request.json';
import PINATA_CONF from '@config/pinata.json';
import { logger, request } from 'utils';
import { withSession } from './utils';

const { METHOD } = REQUEST_CONST;

export default withSession(
  async (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse<any>
  ) => {
    if (req.method === METHOD.GET) {
      const { l = '' }: { l?: string } = req.query;

      const link = new URL(l);
      if (!link.href.includes(PINATA_CONF.IPFS)) {
        return res.status(400).json({ message: 'Invalid link' });
      }

      try {
        const { data } = await request.get(l as string);

        return res.status(200).json(data);
      } catch (e) {
        logger(e);
        return res.status(e.status ?? 404).json(e.message);
      }
    }
  }
);
