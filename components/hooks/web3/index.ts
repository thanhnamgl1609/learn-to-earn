import { useHooks } from '@providers/web3';

export const useAccount = () => {
  const { useAccount } = useHooks();
  const swrResponse = useAccount();

  return {
    account: swrResponse,
  };
};

export const useNetwork = () => {
  const { useNetwork } = useHooks();
  const swrResponse = useNetwork();

  return {
    network: swrResponse,
  };
};

export const useRole = () => {
  const { useRole } = useHooks();
  const swrResponse = useRole();

  return {
    role: swrResponse,
  };
};
