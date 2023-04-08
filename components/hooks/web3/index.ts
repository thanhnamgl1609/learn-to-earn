import { useHooks } from '@providers/web3';
import { UseRegistrationListParams } from './useRegistrationList';

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

export const useUserInfo = () => {
  const { useUserInfo } = useHooks();
  const swrResponse = useUserInfo();

  return {
    userInfo: swrResponse,
  };
};

export const useRegistrationList = (params: UseRegistrationListParams) => {
  const { useRegistrationList } = useHooks();
  const swrResponse = useRegistrationList(params);

  return {
    registrationList: swrResponse,
  };
};

export const useManagement = () => {
  const { useManagement } = useHooks();
  const actions = useManagement();

  return actions;
};

export const useUtilities = () => {
  const { useUtilities } = useHooks();

  return useUtilities();
}

export const useRegistrationActions = () => {
  const { useRegistrationActions } = useHooks();

  return useRegistrationActions();
}
