import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-iron-session';
import { v4 as uuidv4 } from 'uuid';
import FormData from 'form-data';

import request from 'utils/request';
import { FileReq } from '@_types/common';
import REQUEST_CONST from '@config/request.json';
import { withSession } from './utils';
import addressCheckMiddleware from './middleware/address-check';

const { METHOD } = REQUEST_CONST;

export default withSession(
  async (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse<any>
  ) => {
    if (req.method === METHOD.GET) {
      const { l = '' }: { l?: string } = req.query;

      try {
        const link = new URL(l);
        if (link.host !== 'gateway.pinata.cloud') throw new Error();
      } catch {
        return res.status(400).json({ message: 'Invalid link' });
      }

      try {
        const { data } = await request.get(l as string);

        return res.status(200).json(data);
      } catch (e) {
        return res.status(e.status ?? 404).json(e.message);
      }
    }
  }
);
