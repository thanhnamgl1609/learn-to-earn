import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';
import * as utils from 'ethereumjs-util';
import { createError } from '@api/utils/create-error';

// const RPC_PROVIDER_URL =
//   ENV_CONST.RPC_PROVIDER_URL || ('http://127.0.0.1:7545' as string);

export default async (
  req: NextApiRequest & { session: Session },
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
      return resolve('Correct address');
    } else {
      return reject(createError(400, 'message is empty'));
    }
  });
};
