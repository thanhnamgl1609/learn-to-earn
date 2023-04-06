import { MetaMaskInpageProvider } from '@metamask/providers';
import { CryptoHookFactory, Web3Dependencies } from '@_types/hooks';
import axios from 'axios';
import { useCallback, useEffect } from 'react';
import useSWR from 'swr';

type UseAccountResponse = {
  connect: () => void;
  // getSignedData: () => Promise<string>;
  isLoading: boolean;
  isInstalled: boolean;
};

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>;

export type UseAccountHook = ReturnType<AccountHookFactory>;

export const hookFactory: AccountHookFactory =
  ({ provider, ethereum, isLoading }) =>
  () => {
    const { data, mutate, ...swr } = useSWR(
      provider ? 'web3/useAccount' : null,
      async () => {
        const accounts = await provider!.listAccounts();

        if (!accounts.length) {
          throw "Oh no! You don't connect to a wallet. Please do it and try again!";
        }

        return accounts[0];
      },
      {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }
    );

    useEffect(() => {
      ethereum?.on('accountsChanged', handleAccountsChanged);

      return () => {
        ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      };
    }, [ethereum]);

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];

      if (accounts.length && accounts[0] !== data) {
        mutate(accounts[0]);
      }
    };

    const connect = () => {
      ethereum
        ?.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        })
        .then((users) => {
          console.log(users);
        })
        .catch((error) => {
          console.log('🚀 ~ file: useAccount.ts:56 ~ connect ~ error:', error);
        });
    };

    // const getSignedData = useCallback(async () => {
    //   const { data: messageToSign } = await axios.get('/api/verify');

    //   const signedData = await ethereum?.request({
    //     method: 'personal_sign',
    //     params: [JSON.stringify(messageToSign), data, messageToSign.id],
    //   });

    //   return signedData;
    // }, [data]);

    return {
      ...swr,
      data,
      mutate,
      connect,
      // getSignedData,
      isLoading: !!isLoading,
      isInstalled: ethereum?.isMetaMask || false,
    };
  };
