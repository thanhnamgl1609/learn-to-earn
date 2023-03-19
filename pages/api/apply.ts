import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import type { Session } from 'next-iron-session';
import { v4 as uuidv4 } from 'uuid';
import CONST from '@config/constants.json';
import REQUEST_CONST from '@config/request.json';
import PINATA_CONST from '@config/pinata.json';
import addressCheckMiddleware from './middleware/address-check';
import {
  withSession,
  contractAddress,
  pinataApiKey,
  pinataSecretApiKey,
} from './utils';

const { ROLES } = CONST;
const { METHOD } = REQUEST_CONST;

export default withSession(
  async (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse<any>
  ) => {
    if (req.method === METHOD.POST) {
      try {
        await addressCheckMiddleware(req, res);

        const { body } = req;
        const { role, fullName, documentURIs } = body.data;
        switch (role) {
          case ROLES.TEACHER:
            if (!fullName || !documentURIs?.length) {
              return res.status(400).json({ message: 'data are missing' });
            }
            break;
          default:
            return res.status(400);
        }

        const jsonRes = await axios.post(
          PINATA_CONST.PINNING_JSON,
          {
            pinataMetadata: {
              name: uuidv4(),
            },
            pinataContent: {
              fullName,
              documentURIs,
            },
          },
          {
            headers: {
              pinata_api_key: pinataApiKey,
              pinata_secret_api_key: pinataSecretApiKey,
            },
          }
        );

        return res.status(200).json(jsonRes.data);
      } catch (e) {
        console.log('🚀 ~ file: apply.ts:59 ~ e:', e);
        return res.status(422).json({ message: 'cannot create json' });
      }
    }
  }
);
