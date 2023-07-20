import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import type { Session } from 'next-iron-session';
import { v4 as uuidv4 } from 'uuid';
import PINATA_CONST from '@config/pinata.json';
import {
  withSession,
  nftIdentitiesContractAddress,
  schoolsContractAddress,
  nftCertificatesContractAddress,
  pinataJWTKey,
} from './utils';
import addressCheckMiddleware from './middleware/address-check';

export default withSession(
  async (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse<any>
  ) => {
    if (req.method === 'POST') {
      try {
        const { body } = req;
        const nft = body.data;
        if (!nft.name || !nft.description || !nft.attributes) {
          return res
            .status(422)
            .json({ message: 'data are missing' });
        }

        await addressCheckMiddleware(req, res);

        const jsonRes = await axios.post(
          PINATA_CONST.PINNING,
          {
            pinataMetadata: {
              name: uuidv4(),
            },
            pinataContent: nft,
          },
          {
            headers: {
              Authorization: pinataJWTKey,
            },
          }
        );

        return res.status(200).json(jsonRes.data);
      } catch (e) {
        return res
          .status(422)
          .json({ message: 'cannot create json' });
      }
    } else if (req.method === 'GET') {
      try {
        const message = {
          id: uuidv4(),
          nftIdentitiesContractAddress,
          schoolsContractAddress,
          nftCertificatesContractAddress,
        };
        req.session.set('message-session', message);
        await req.session.save();
        return res.json(message);
      } catch (e) {
        res
          .status(422)
          .json({ message: 'cannot generate a message!' });
      }
    } else {
      res.status(404).json({ message: 'not found' });
    }
  }
);
