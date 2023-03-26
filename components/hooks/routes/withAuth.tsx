import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { RouteConfig, DEFAULT_ROUTE } from './config';
import { NextComponentType, NextPageContext } from 'next';
import { useUserInfo } from '@hooks/web3';

const withAuth =
  (Component: NextComponentType<NextPageContext, any, any>) =>
  (props: any): JSX.Element => {
    const {
      userInfo: { data },
    } = useUserInfo();
    const { role } = data || { role: null };
    const router = useRouter();
    const isValidRoute = useMemo(
      () => RouteConfig[role][router.pathname],
      [router.pathname]
    );

    useEffect(() => {
      if (!isValidRoute) {
        router.push(role ? RouteConfig[role].default : DEFAULT_ROUTE);
      }
    }, [isValidRoute, role]);

    return isValidRoute ? <Component {...props} /> : null;
  };

export default withAuth;
