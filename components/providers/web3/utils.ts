import { setupHooks, Web3Hooks } from '@hooks/web3/setupHooks';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { Web3Dependencies } from '@_types/hooks';
import { providers, Contract } from 'ethers';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type Web3State = {
  isLoading: boolean;
  hooks: Web3Hooks;
} & Nullable<Web3Dependencies>;

export const createDefaultState = () => ({
  ethereum: null,
  provider: null,
  contracts: null,
  isLoading: true,
  hooks: setupHooks({ isLoading: true } as any),
});

export const createWeb3State = ({
  ethereum,
  provider,
  contracts,
  isLoading,
}: Web3Dependencies) => ({
  ethereum,
  provider,
  contracts,
  isLoading,
  hooks: setupHooks({ ethereum, provider, contracts, isLoading }),
});

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (
  name: string,
  provider: providers.Web3Provider
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject('Network ID is not defined');
  }

  const res = await fetch(`/contracts/${name}.json/`);
  const Artifact = await res.json();

  if (Artifact.networks[NETWORK_ID].address) {
    const contract = new Contract(
      Artifact.networks[NETWORK_ID].address,
      Artifact.abi,
      provider
    );

    return contract;
  }

  return Promise.reject(`Contract [${name}] cannot be loaded`);
};
