import { CryptoHookFactory, Web3Dependencies } from '@_types/hooks';
import { useEffect } from 'react';
import useSWR from 'swr';

const NETWORKS: { [k: string]: string } = {
  1: 'Ethereum Mainnet',
  5: 'Goerli test network',
  11155111: 'Sepolia test network',
  1337: 'Ganache',
};

const targetId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string;
const targetNetwork = NETWORKS[targetId];

type UseNetworkResponse = {
  isLoading: boolean;
  isSupported: boolean;
  isConnectedToNetwork: boolean;
  targetNetwork: string;
};

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>;

export type UseNetworkHook = ReturnType<NetworkHookFactory>;

export const hookFactory: NetworkHookFactory =
  ({ provider, ethereum, isLoading }) =>
  () => {
    const { data, ...swr } = useSWR(
      provider ? 'web3/useNetwork' : null,
      async () => {
        const chainId = (await provider!.getNetwork()).chainId;

        if (!chainId) {
          throw 'Cannot retrieve network. Please try again!';
        }

        return NETWORKS[chainId];
      },
      {
        revalidateOnFocus: false,
      }
    );

    const isSupported = data == targetNetwork;

    return {
      ...swr,
      data,
      targetNetwork,
      isSupported,
      isConnectedToNetwork: !isLoading && isSupported,
      isLoading: !!isLoading,
    };
  };
