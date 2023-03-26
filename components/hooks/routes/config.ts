import CONST from '@config/constants.json';
import Routes from '@config/routes.json';

const { ROLES } = CONST;
const DEFAULT_ROUTE = Routes.home;

const RouteConfig = {
  [ROLES.STUDENT]: {
    default: Routes.profile,
    [Routes.profile]: Routes.profile,
  },
  [ROLES.TEACHER]: {
    default: Routes.profile,
    [Routes.profile]: Routes.profile,
  },
  [ROLES.VISITOR]: {
    default: Routes.home,
    [Routes.home]: Routes.home,
    [Routes.applyTeacher]: Routes.applyTeacher,
  },
  [ROLES.REGISTERED]: {
    default: Routes.applicationDetail,
    [Routes.applicationDetail]: Routes.applicationDetail,
  },
  [ROLES.COUNCIL]: {
    default: Routes.manage,
    [Routes.manage]: Routes.manage,
    [Routes.manageTeacherRegistration]: Routes.manageTeacherRegistration,
    [Routes.teacherApplication]: Routes.teacherApplication,
    [Routes.teacherApplicationDetail]: Routes.teacherApplicationDetail,
  },
};

export { RouteConfig, DEFAULT_ROUTE };