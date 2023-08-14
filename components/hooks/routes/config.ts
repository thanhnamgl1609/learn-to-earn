import CONST from '@config/constants.json';
import Routes from '@config/routes.json';

const { ROLES } = CONST;
const DEFAULT_ROUTE = Routes.home.name;
const withParam = (path: string, param = '[param]') =>
  `${path}/${param}`;

export type Route = {
  name: string;
  as?: string;
};
type RouteConfigType = {
  [key: string]: {
    default: Route;
    [key: string]: Route;
  };
};

const RouteConfig: RouteConfigType = {
  [ROLES.STUDENT]: {
    default: Routes.profile,
    [Routes.profile.name]: Routes.profile,
    [Routes.school.name]: Routes.school,
    [Routes.schoolClassDetail.name]: Routes.schoolClassDetail,
    [Routes.schoolClassList.name]: Routes.schoolClassList,
    [Routes.selfCompleteCourse.name]: Routes.selfCompleteCourse,
    [Routes.requestGraduation.name]: Routes.requestGraduation,
    [Routes.myRequestGraduation.name]: Routes.myRequestGraduation,
    [Routes.myGraduationDetail.name]: Routes.myGraduationDetail,
  },
  [ROLES.TEACHER]: {
    default: Routes.profile,
    [Routes.profile.name]: Routes.profile,
    [Routes.classDetail.name]: Routes.classDetail,
  },
  [ROLES.VISITOR]: {
    default: Routes.register,
    [Routes.register.name]: Routes.register,
  },
  [ROLES.REGISTERED]: {
    default: Routes.registerDetail,
    [Routes.registerDetail.name]: Routes.registerDetail,
  },
  [ROLES.COUNCIL]: {
    default: Routes.manage,
    [Routes.manage.name]: Routes.manage,
    [Routes.manageRegistration.name]: Routes.manageRegistration,
    [Routes.manageRegistrationDetail.name]:
      Routes.manageRegistrationDetail,
    [Routes.courses.name]: Routes.courses,
    [Routes.createCourse.name]: Routes.createCourse,
    [Routes.courseDetail.name]: Routes.courseDetail,
    [Routes.classes.name]: Routes.classes,
    [Routes.createClass.name]: Routes.createClass,
    [Routes.classDetail.name]: Routes.classDetail,
    [Routes.registerTime.name]: Routes.registerTime,
    [Routes.member.name]: Routes.member,
    [Routes.memberDetail.name]: Routes.memberDetail,
    [Routes.graduationCondition.name]: Routes.graduationCondition,
    [Routes.requestGraduationList.name]: Routes.requestGraduationList,
    [Routes.requestGraduationDetail.name]:
      Routes.requestGraduationDetail,
    [Routes.graduationList.name]: Routes.graduationList,
    [Routes.graduationDetail.name]: Routes.graduationDetail,
  },
  [ROLES.GUEST]: {
    default: Routes.search,
    [Routes.search.name]: Routes.search,
  },
};

export { RouteConfig, DEFAULT_ROUTE };
