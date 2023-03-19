import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';
import * as utils from 'ethereumjs-util';

// const RPC_PROVIDER_URL =
//   ENV_CONST.RPC_PROVIDER_URL || ('http://127.0.0.1:7545' as string);

export default async (
  req: NextApiRequest & { session: Session },
  response: NextApiResponse
) => {
  return new Promise(async (resolve, reject) => {
    const message = req.session.get('message-session');
    // const provider = new ethers.providers.JsonRpcProvider(
    //   'http://127.0.0.1:7545'
    // );
    // const contract = new ethers.Contract(
    //   contractAddress,
    //   abi,
    //   provider.getSigner()
    // );

    let nonce: string | Buffer =
      '\x19Ethereum Signed Message:\n' +
      JSON.stringify(message).length +
      JSON.stringify(message);

    nonce = utils.keccak(Buffer.from(nonce, 'utf-8'));
    const { v, r, s } = utils.fromRpcSig(req.body.signature);
    const publicKey = utils.ecrecover(utils.toBuffer(nonce), v, r, s);
    const addrBuffer = utils.pubToAddress(publicKey);
    const address = utils.bufferToHex(addrBuffer);

    if (address === req.body.address.toLowerCase()) {
      resolve('Correct address');
    } else {
      reject('message is empty');
    }
  });
};
