import { useCertificateActions } from '@hooks/web3';
import useSWR, { SWRResponse } from 'swr';

export const useRequestGraduationPrice = (): SWRResponse<string> => {
  const { getRequestGraduationPrice } = useCertificateActions();

  const result = useSWR('requestPrice', () => {
    return getRequestGraduationPrice();
  });

  return result;
};
