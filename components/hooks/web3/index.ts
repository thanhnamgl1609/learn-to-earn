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

export const useRoles = () => {
  const { useRoles } = useHooks();
  const swrResponse = useRoles();

  return {
    roles: swrResponse,
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
