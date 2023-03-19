import { useMemo } from 'react';
import { AppLoading } from '..';
import { withAuth } from '@hooks/routes';
import { useAppSelector } from '@hooks/stores';
import { selectApp } from '@store/appSlice';
import { AppProps } from 'next/app';

const AuthWrapper = ({ Component, pageProps }: AppProps) => {
  const appState = useAppSelector(selectApp);
  const AuthComponent = useMemo(() => withAuth(Component), [Component]);

  return !appState.initialUser ? (
    <AppLoading />
  ) : (
    <AuthComponent {...pageProps} />
  );
};

export default AuthWrapper;
