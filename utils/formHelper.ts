import { MetaMaskInpageProvider } from '@metamask/providers';
import axios from 'axios';

export const getSignedData = async (
  ethereum: MetaMaskInpageProvider,
  account: string
) => {
  const { data: messageToSign } = await axios.get('/api/verify');
  const signedData = await ethereum?.request({
    method: 'personal_sign',
    params: [JSON.stringify(messageToSign), account, messageToSign.id],
  });

  return signedData;
};
