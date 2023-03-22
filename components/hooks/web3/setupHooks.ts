import { Web3Dependencies } from '@_types/hooks';
import { hookFactory as createAccountHook, UseAccountHook } from './useAccount';
import { hookFactory as createNetworkHook, UseNetworkHook } from './useNetwork';
import {
  hookFactory as createUserInfoHook,
  UseUserInfoHook,
} from './useUserInfo';
import {
  hookFactory as createRegistrationListHook,
  UseRegistrationListHook,
} from './useRegistrationList';

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
  useUserInfo: UseUserInfoHook;
  useRegistrationList: UseRegistrationListHook;
};

type SetupHooks = {
  (deps: Web3Dependencies): Web3Hooks;
};

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps),
    useUserInfo: createUserInfoHook(deps),
    useRegistrationList: createRegistrationListHook(deps),
  };
};
