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

    const isValidRoute = useMemo(() => {
      const pathname = router.pathname.replace(
        /\[(\w+)\]/,
        (_, paramKey) => `:${paramKey}`
      );
      console.log("🚀 ~ file: withAuth.tsx:24 ~ isValidRoute ~ pathname:", pathname)
      const route = RouteConfig[role][pathname];

      return !!route;
    }, [router.pathname, role]);

    useEffect(() => {
      if (!isValidRoute) {
        router.replace(role ? RouteConfig[role].default : DEFAULT_ROUTE);
      }
    }, [isValidRoute, role]);

    return isValidRoute ? <Component {...props} /> : null;
  };

export default withAuth;
