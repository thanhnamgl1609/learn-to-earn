import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import type { Session } from 'next-iron-session';
import { v4 as uuidv4 } from 'uuid';
import {
  withSession,
  addressCheckMiddleware,
  pinataApiKey,
  pinataSecretApiKey,
} from './utils';
import { FileReq } from '@_types/nft';
import FormData from 'form-data';

export default withSession(
  async (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse<any>
  ) => {
    if (req.method === 'POST') {
      try {
        const { bytes, fileName, contentType } = req.body as FileReq;

        if (!bytes || !fileName || !contentType) {
          return res.status(422).json({ message: 'data is missing' });
        }

        await addressCheckMiddleware(req, res);
        const buffer = Buffer.from(Object.values(bytes));
        const formData = new FormData();
        formData.append('file', buffer, {
          filename: `${fileName}-${uuidv4()}`,
          contentType,
        });

        const fileRes = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          formData,
          {
            maxBodyLength: Infinity,
            headers: {
              'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
              pinata_api_key: pinataApiKey,
              pinata_secret_api_key: pinataSecretApiKey,
            },
          }
        );

        return res.status(200).json(fileRes.data);
      } catch (e) {
        console.log('🚀 ~ file: verify.ts:47 ~ e', e);
        return res.status(422).json({ message: 'cannot create json' });
      }
    } else {
      res.status(404).json({ message: 'not found' });
    }
  }
);
