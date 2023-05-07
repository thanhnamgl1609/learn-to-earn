import { useHooks } from '@providers/web3';
import { UseCourseDetailParams } from './useCourseDetail';
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

export const useUtilities = () => {
  const { useUtilities } = useHooks();

  return useUtilities();
};

export const useRegistrationActions = () => {
  const { useRegistrationActions } = useHooks();
  const actions = useRegistrationActions();

  return actions;
};

export const useSchoolActions = () => {
  const { useSchoolActions } = useHooks();
  const actions = useSchoolActions();

  return actions;
};

export const useCourseList = () => {
  const { useCourseList } = useHooks();
  const courseList = useCourseList();

  return { courseList };
};

export const useCourseDetail = (params: UseCourseDetailParams) => {
  const { useCourseDetail } = useHooks();
  const courseDetail = useCourseDetail(params);

  return { courseDetail };
};

export const useRegisterTime = () => {
  const { useRegisterTime } = useHooks();
  const registerTime = useRegisterTime();

  return { registerTime };
};
