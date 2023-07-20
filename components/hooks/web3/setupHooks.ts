import { Web3Dependencies } from '@_types/hooks';
import {
  hookFactory as createAccountHook,
  UseAccountHook,
} from './useAccount';
import {
  hookFactory as createNetworkHook,
  UseNetworkHook,
} from './useNetwork';
import {
  hookFactory as createUserInfoHook,
  UseUserInfoHook,
} from './useUserInfo';
import {
  hookFactory as createRegistrationListHook,
  UseRegistrationListHook,
} from './useRegistrationList';
import {
  hookFactory as createUtilitiesHook,
  UseUtilitiesHook,
} from './useUtilities';
import {
  hookFactory as createRegistrationActionsHook,
  UseRegistrationActionsHook,
} from './useRegistrationActions';
import {
  hookFactory as createSchoolActionsHook,
  UseSchoolActionsHook,
} from './useSchoolActions';
import {
  hookFactory as createCourseListHook,
  UseCourseListHook,
} from './useCourseList';
import {
  hookFactory as createCourseDetailHook,
  UseCourseDetailHook,
} from './useCourseDetail';
import {
  hookFactory as createRegisterTimeHook,
  UseRegisterTimeHook,
} from './useRegisterTime';
import {
  hookFactory as createMemberListHook,
  UseMemberListHook,
} from './useMemberList';
import {
  hookFactory as createClassListHook,
  UseClassListHook,
} from './useClassList';
import {
  hookFactory as createClassDetailHook,
  UseClassDetailHook,
} from './useClassDetail';
import {
  hookFactory as createAssignedClassesHook,
  UseAssignedClassesHook,
} from './useAssignedClasses';
import {
  hookFactory as createIdentitiesActionsHook,
  UseIdentitiesActionsHook,
} from './useIdentitiesActions';
import {
  hookFactory as createNftClassRegistrationActionsHook,
  UseNftClassRegistrationActionsHook,
} from './useNftClassRegistrationActions';
import {
  hookFactory as createCertificateActionsHook,
  UseCertificateActionsHook,
} from './useCertificateActions';

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
  useUserInfo: UseUserInfoHook;
  useRegistrationList: UseRegistrationListHook;
  useUtilities: UseUtilitiesHook;
  useRegistrationActions: UseRegistrationActionsHook;
  useSchoolActions: UseSchoolActionsHook;
  useCourseList: UseCourseListHook;
  useCourseDetail: UseCourseDetailHook;
  useRegisterTime: UseRegisterTimeHook;
  useMemberList: UseMemberListHook;
  useClassList: UseClassListHook;
  useClassDetail: UseClassDetailHook;
  useAssignedClasses: UseAssignedClassesHook;
  useIdentitiesActions: UseIdentitiesActionsHook;
  useNftClassRegistrationActions: UseNftClassRegistrationActionsHook;
  useCertificateActions: UseCertificateActionsHook;
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
    useUtilities: createUtilitiesHook(deps),
    useRegistrationActions: createRegistrationActionsHook(deps),
    useSchoolActions: createSchoolActionsHook(deps),
    useCourseList: createCourseListHook(deps),
    useCourseDetail: createCourseDetailHook(deps),
    useRegisterTime: createRegisterTimeHook(deps),
    useMemberList: createMemberListHook(deps),
    useClassList: createClassListHook(deps),
    useClassDetail: createClassDetailHook(deps),
    useAssignedClasses: createAssignedClassesHook(deps),
    useIdentitiesActions: createIdentitiesActionsHook(deps),
    useNftClassRegistrationActions:
      createNftClassRegistrationActionsHook(deps),
    useCertificateActions: createCertificateActionsHook(deps),
  };
};
