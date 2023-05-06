import type { NextApiRequest, NextApiResponse } from 'next';
import REQUEST_CONST from '@config/request.json';
import { uploadFile } from './middleware';
import { logger } from 'utils';

const { METHOD } = REQUEST_CONST;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method === METHOD.POST) {
    try {
      uploadFile({
        req,
        onSuccess: (_, file) =>
          res.status(200).json({ url: `/upload/${file.newFilename}` }),
        onError: () => res.status(422).json({ message: 'cannot create json' }),
      });
    } catch (e) {
      logger('🚀 ~ file: verify-image.ts:23 ~ e:', e);
      return res.status(422).json({ message: 'cannot create json' });
    }
  } else {
    res.status(404).json({ message: 'not found' });
  }
};
