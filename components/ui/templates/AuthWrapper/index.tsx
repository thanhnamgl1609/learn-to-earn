import { AppProps } from 'next/app';
import { useMemo } from 'react';
import { Modal, BaseLayout } from '@templates';
import { AppLoading } from '..';
import { withAuth } from '@hooks/routes';
import { useAppSelector } from '@hooks/stores';
import { selectUser } from '@store/userSlice';

const AuthWrapper = ({ Component, pageProps }: AppProps) => {
  const { role } = useAppSelector(selectUser);
  const AuthComponent = useMemo(() => withAuth(Component), [Component]);

  return role === null ? (
    <>
      <BaseLayout />
      <Modal isOpen={true} closable={false} overlay="bg-black/80">
        <AppLoading />
      </Modal>
    </>
  ) : (
    <AuthComponent {...pageProps} />
  );
};

export default AuthWrapper;
