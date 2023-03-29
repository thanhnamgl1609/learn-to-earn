import { AppProps } from 'next/app';
import { useMemo } from 'react';
import { Modal, BaseLayout } from '@templates';
import { AppLoading } from '..';
import { withAuth } from '@hooks/routes';
import { useAppSelector } from '@hooks/stores';
import { selectApp } from '@store/appSlice';

const AuthWrapper = ({ Component, pageProps }: AppProps) => {
  const appState = useAppSelector(selectApp);
  const AuthComponent = useMemo(() => withAuth(Component), [Component]);

  return !appState.loading ? (
    <>
      <BaseLayout />
      <Modal isOpen={true} closable={false} darkPercent={80}>
        <AppLoading />
      </Modal>
    </>
  ) : (
    <AuthComponent {...pageProps} />
  );
};

export default AuthWrapper;
