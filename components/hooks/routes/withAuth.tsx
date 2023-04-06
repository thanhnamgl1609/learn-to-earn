import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { NextComponentType, NextPageContext } from 'next';

import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { useAppSelector } from '@hooks/stores';
import { selectUser } from '@store/userSlice';
import { RouteConfig, DEFAULT_ROUTE } from './config';

type Param = {
  role?: string;
};

const { REGISTRATION_ROLES } = CONST;
const REGISTRATION_ROLE_NAMES = Object.keys(REGISTRATION_ROLES);

const withAuth =
  (Component: NextComponentType<NextPageContext, any, any>) =>
  (props: any): JSX.Element => {
    const router = useRouter();
    const { roleType: role } = useAppSelector(selectUser);
    const { role: roleParam } = router.query as Param;

    const isValidRoute = useMemo(() => {
      const pathname = router.pathname.replace(
        /\[(\w+)\]/,
        (_, paramKey) => `:${paramKey}`
      );
      const route = RouteConfig[role][pathname];
      return !!route;

      // switch (route) {
      //   case Routes.register:
      //     const isExistRole = REGISTRATION_ROLE_NAMES.some(
      //       (roleName) => roleName.toLowerCase() === roleParam
      //     );
      //     const hasRole = roles.some(
      //       (roleId) => roleId === parseInt(REGISTRATION_ROLES[roleParam])
      //     );

      //     return isExistRole && !hasRole;
      //   default:
      //     return !!route;
      // }
    }, [router.pathname, roleParam, role]);

    useEffect(() => {
      if (!isValidRoute) {
        router.replace(role ? RouteConfig[role].default : DEFAULT_ROUTE);
      }
    }, [isValidRoute, role]);

    return isValidRoute ? <Component {...props} /> : null;
  };

export default withAuth;
