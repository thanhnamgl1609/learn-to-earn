import { useHooks } from '@providers/web3';
import { UseAssignedClassesParams } from './useAssignedClasses';
import { UseClassDetailParams } from './useClassDetail';
import { UseClassListParams } from './useClassList';
import { UseCourseDetailParams } from './useCourseDetail';
import { UseMemberListParams } from './useMemberList';
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

export const useMemberList = (params: UseMemberListParams) => {
  const { useMemberList } = useHooks();
  const memberList = useMemberList(params);

  return { memberList };
};

export const useClassList = (params?: UseClassListParams) => {
  const { useClassList } = useHooks();
  const classList = useClassList(params);

  return { classList };
};

export const useClassDetail = (params: UseClassDetailParams) => {
  const { useClassDetail } = useHooks();
  const classDetail = useClassDetail(params);

  return { classDetail };
};

export const useRegisteredClasses = () => {
  const { useRegisteredClasses } = useHooks();
  const registeredClasses = useRegisteredClasses();

  return { registeredClasses };
};

export const useAssignedClasses = (params: UseAssignedClassesParams) => {
  const { useAssignedClasses } = useHooks();
  const assignedClasses = useAssignedClasses(params);

  return { assignedClasses };
};

export const useIdentitiesActions = () => {
  const { useIdentitiesActions } = useHooks();
  const actions = useIdentitiesActions();

  return actions;
};

export const useNftClassRegistrationActions = () => {
  const { useNftClassRegistrationActions } = useHooks();
  const actions = useNftClassRegistrationActions();

  return actions;
};

export const useCertificateActions = () => {
  const { useCertificateActions } = useHooks();
  const actions = useCertificateActions();

  return actions;
};
