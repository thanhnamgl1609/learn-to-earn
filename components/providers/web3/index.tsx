import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  createDefaultState,
  createWeb3State,
  loadContract,
  Web3State,
} from './utils';
import { ethers } from 'ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { NftCertificates, NftIdentities, NftSchool } from '@_types/contracts';

const pageReload = () => window.location.reload();

const Web3Context = createContext<Web3State>(createDefaultState());

const Web3Provider: FC<PropsWithChildren> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

  const handleAccountChange =
    (ethereum: MetaMaskInpageProvider) => async () => {
      pageReload();
    };
  const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
    ethereum.on('chainChanged', pageReload);
    ethereum.on('accountsChanged', handleAccountChange(ethereum));
  };
  const removeGlobalListeners = (ethereum?: MetaMaskInpageProvider) => {
    ethereum?.removeListener('chainChanged', pageReload);
    ethereum?.removeListener('accountsChanged', handleAccountChange(ethereum));
  };

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const ethereum = window.ethereum;
        const provider = new ethers.providers.Web3Provider(ethereum as any);

        const [nftIdentities, nftSchool, nftCertificates] = await Promise.all([
          loadSignedContract('NftIdentities', provider),
          loadSignedContract('NftSchool', provider),
          loadSignedContract('NftCertificates', provider),
        ]);
        const contracts = {
          nftIdentities: nftIdentities as unknown as NftIdentities,
          nftSchool: nftSchool as unknown as NftSchool,
          nftCertificates: nftCertificates as unknown as NftCertificates,
        };

        setGlobalListeners(ethereum);
        setWeb3Api(
          createWeb3State({
            ethereum,
            provider,
            contracts,
            isLoading: false,
          })
        );
      } catch (e) {
        setWeb3Api(({ hooks, ...api }) =>
          createWeb3State({
            ...(api as any),
            isLoading: false,
          })
        );
      }
    };

    const loadSignedContract = async (name, provider) => {
      const contract = await loadContract(name, provider);
      const signerContract = provider.getSigner();
      return contract.connect(signerContract);
    };

    initWeb3();
    return () => removeGlobalListeners(window.ethereum);
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export function useWeb3() {
  return useContext(Web3Context);
}

export function useContracts() {
  const { contracts } = useWeb3();

  return contracts;
}

export function useHooks() {
  const { hooks } = useWeb3();

  return hooks;
}

export default Web3Provider;
