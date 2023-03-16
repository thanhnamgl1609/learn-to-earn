import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import type { Session } from 'next-iron-session';
import { v4 as uuidv4 } from 'uuid';
import {
  withSession,
  contractAddress,
  addressCheckMiddleware,
  pinataApiKey,
  pinataSecretApiKey,
} from './utils';
import { NftMeta } from '@_types/nft';

export default withSession(
  async (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse<any>
  ) => {
    if (req.method === 'POST') {
      try {
        const { body } = req;
        const nft = body.nft as NftMeta;
        if (!nft.name || !nft.description || !nft.attributes) {
          return res.status(422).json({ message: 'data are missing' });
        }

        await addressCheckMiddleware(req, res);

        const jsonRes = await axios.post(
          'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          {
            pinataMetadata: {
              name: uuidv4(),
            },
            pinataContent: nft,
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
        console.log("🚀 ~ file: verify.ts:47 ~ e", e)
        return res.status(422).json({ message: 'cannot create json' });
      }
    } else if (req.method === 'GET') {
      try {
        const message = { contractAddress, id: uuidv4() };
        req.session.set('message-session', message);
        await req.session.save();
        return res.json(message);
      } catch (e) {
        res.status(422).json({ message: 'cannot generate a message!' });
      }
    } else {
      res.status(404).json({ message: 'not found' });
    }
  }
);
