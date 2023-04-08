import CONST from '@config/constants.json';
import Routes from '@config/routes.json';

const { ROLES } = CONST;
const DEFAULT_ROUTE = Routes.home;
const withParam = (path: string, param = '[param]') => `${path}/${param}`;

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
    default: Routes.register,
    [Routes.register]: Routes.register,
  },
  [ROLES.REGISTERED]: {
    default: Routes.registerDetail,
    [Routes.registerDetail]: Routes.registerDetail,
  },
  [ROLES.COUNCIL]: {
    default: Routes.manage,
    [Routes.manage]: Routes.manage,
    [Routes.manageTeacherRegistration]: Routes.manageTeacherRegistration,
    [withParam(Routes.manageTeacherRegistration, '[address]')]: withParam(
      Routes.manageTeacherRegistration
    ),
    [Routes.teacherApplication]: Routes.teacherApplication,
    [Routes.teacherApplicationDetail]: Routes.teacherApplicationDetail,
  },
};

export { RouteConfig, DEFAULT_ROUTE };
