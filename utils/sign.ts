import { Web3Dependencies } from '@_types/hooks';
import endpoints from 'config/endpoints.json';
import { request } from './request';

export const getSignedData = async ({
  provider,
  ethereum,
}: Web3Dependencies): Promise<{
  account: string | null;
  signature: string;
}> => {
  const accounts = await provider?.listAccounts();

  if (accounts && accounts[0] && ethereum) {
    const { data: messageToSign } = await request.post(endpoints.sign);
    const signature = (await ethereum?.request({
      method: 'personal_sign',
      params: [JSON.stringify(messageToSign), accounts[0], messageToSign.id],
    })) as string;

    return { account: accounts[0], signature };
  }

  return { account: null, signature: '' };
};
