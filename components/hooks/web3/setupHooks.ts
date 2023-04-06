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
import {
  hookFactory as createManagementHook,
  UseManagementHook,
} from './useManagement';

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
  useUserInfo: UseUserInfoHook;
  useRegistrationList: UseRegistrationListHook;
  useManagement: UseManagementHook;
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
    useManagement: createManagementHook(deps),
  };
};
