import { NextPage } from 'next';
import { useEffect } from 'react';
import { useAppDispatch } from '@hooks/stores';
import { useNetwork, useUserInfo } from '@hooks/web3';
import { updateState } from '@store/appSlice';
import { updateUser } from '@store/userSlice';
import { Loading } from '@atoms';
import { BaseLayout } from '@templates';

const AppLoading: NextPage = () => {
  const { userInfo } = useUserInfo();
  const { network } = useNetwork();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userInfo.error && userInfo.data) {
      dispatch(updateUser({
        role: userInfo.data.role,
        isExpired: userInfo.data.isExpired,
        isRequestSent: userInfo.data.isRequestSent,
        nftIdentity: userInfo.data.nftIdentity,
        registration: userInfo.data.registration,
      }));
      dispatch(updateState({ initialUser: true }));
    }
  }, [userInfo]);

  return (
    <BaseLayout>
      <div className="text-center text-xl font-bold uppercase">
        {network.isLoading ? (
          <Loading />
        ) : userInfo.error ? (
          'Cannot load user info'
        ) : (
          'Install Web3 Wallet'
        )}
      </div>
    </BaseLayout>
  );
};

export default AppLoading;
