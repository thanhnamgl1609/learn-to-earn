import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';
import * as utils from 'ethereumjs-util';
import { createError } from '@api/utils/create-error';

export default async (
  req: NextApiRequest & { session: Session; address?: string },
  response: NextApiResponse
) => {
  return new Promise(async (resolve, reject) => {
    const { signature, address } = req.body;
    if (!signature || !address) {
      return reject(createError(400, 'Lack of signature'));
    }
    const message = req.session.get('message-session');

    let nonce: string | Buffer =
      '\x19Ethereum Signed Message:\n' +
      JSON.stringify(message).length +
      JSON.stringify(message);

    nonce = utils.keccak(Buffer.from(nonce, 'utf-8'));
    const { v, r, s } = utils.fromRpcSig(signature);
    const publicKey = utils.ecrecover(utils.toBuffer(nonce), v, r, s);
    const addrBuffer = utils.pubToAddress(publicKey);
    const decodedAddress = utils.bufferToHex(addrBuffer);

    if (decodedAddress === address.toLowerCase()) {
      req.address = address;
      return resolve('Correct address');
    } else {
      return reject(createError(400, 'message is empty'));
    }
  });
};
