import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { NextComponentType, NextPageContext } from 'next';

import { useAppSelector } from '@hooks/stores';
import { selectUser } from '@store/userSlice';
import { RouteConfig, DEFAULT_ROUTE } from './config';

type Param = {
  role?: string;
};

const withAuth =
  (Component: NextComponentType<NextPageContext, any, any>) =>
  (props: any): JSX.Element => {
    const router = useRouter();
    const { roleType: role } = useAppSelector(selectUser);

    const currentRoute = useMemo(() => {
      const pathname = router.pathname.replace(
        /\[(\w+)\]/,
        (_, paramKey) => `:${paramKey}`
      );
      const route = RouteConfig[role][pathname];

      return route;
    }, [role]);

    useEffect(() => {
      if (!currentRoute) {
        router.replace(!Number.isNaN(role) ? RouteConfig[role].default.name : DEFAULT_ROUTE);
      } else if (currentRoute.as && router.asPath !== currentRoute.as) {
        router.push(currentRoute.name, currentRoute.as, { shallow: false });
      }
    }, [currentRoute, role]);

    return currentRoute ? <Component {...props} /> : null;
  };

export default withAuth;
