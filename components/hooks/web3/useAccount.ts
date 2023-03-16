import { CryptoHookFactory, Web3Dependencies } from '@_types/hooks';
import { useEffect } from 'react';
import useSWR from 'swr';

type UseAccountResponse = {
  connect: () => void;
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
      try {
        ethereum?.request({ method: 'eth_requestAccounts' });
      } catch (e) {
        console.error(e);
      }
    };

    return {
      ...swr,
      data,
      mutate,
      connect,
      isLoading: !!isLoading,
      isInstalled: ethereum?.isMetaMask || false,
    };
  };
