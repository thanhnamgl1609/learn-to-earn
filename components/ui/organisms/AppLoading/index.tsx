import { NextPage } from 'next';
import { useEffect, useMemo } from 'react';
import { NftIdentity, RegistrationInfo } from '@_types/nftIdentity';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { Route, RouteConfig } from '@hooks/routes/config';
import { useAppDispatch } from '@hooks/stores';
import { useAccount, useUserInfo } from '@hooks/web3';
import { type RoleType, updateUser } from '@store/userSlice';
import { Button, CircleBox, CircleButton, CircleLink, Loading } from '@atoms';
import MetaMaskIcon from './MetaMaskIcon';
import { useRouter } from 'next/router';
import { useOwnedUserDetail } from '@hooks/api';
import { useInitializeApp } from '@hooks/common';

const { ROLES, ROLE_LABELS } = CONST;

type OnSelectRole = {
  ({
    role,
    url,
    roleType,
  }: {
    role: number;
    url: Route;
    roleType: RoleType;
  }): () => void;
};

const ALL_ROLES = [ROLES.STUDENT, ROLES.TEACHER];
const REGISTRATION_ROLES = [ROLES.STUDENT, ROLES.TEACHER];
const ROLE_REGISTRATION_URLS = ALL_ROLES.reduce(
  (prev, role) => ({
    ...prev,
    [role]: {
      ...Routes.register,
      name: Routes.register.name.replace(
        ':role',
        ROLE_LABELS[role].toLowerCase()
      ),
    },
  }),
  {}
);
const ROLE_REGISTRATION_DETAIL_URLS = REGISTRATION_ROLES.reduce(
  (prev, role) => ({
    ...prev,
    [role]: {
      ...Routes.registerDetail,
      name: Routes.registerDetail.name.replace(
        ':role',
        ROLE_LABELS[role].toLowerCase()
      ),
    },
  }),
  {}
);

const SignInSection = ({
  nftIdentities,
  onSelect,
}: {
  nftIdentities: NftIdentity[];
  onSelect: OnSelectRole;
}) => (
  <div className="flex justify-center items-center flex-col">
    <p className="text-white capitalize text-3xl text-center">Sign In with</p>
    <div className="mt-4 flex gap-4 justify-center">
      {nftIdentities.map(({ role }) => (
        <Button
          className="bg-white text-xl uppercase text-gray-800 px-8 py-4"
          key={role}
          onClick={onSelect({
            role,
            url: RouteConfig[role].default,
            roleType: role,
          })}
        >
          {ROLE_LABELS[role]}
        </Button>
      ))}
    </div>
  </div>
);

const RegistrationSection = ({
  registrationInfos,
  onSelect,
}: {
  registrationInfos: RegistrationInfo[];
  onSelect: OnSelectRole;
}) => (
  <div className="flex items-center flex-col">
    <p className="text-white capitalize text-3xl text-center">
      Registration Detail
    </p>
    <div className="mt-4 flex flex-col gap-4 justify-center">
      {registrationInfos.map(({ role }) => (
        <Button
          className="bg-white text-xl uppercase text-gray-800 px-8 py-4"
          key={role}
          onClick={onSelect({
            role,
            url: ROLE_REGISTRATION_DETAIL_URLS[role],
            roleType: ROLES.REGISTERED,
          })}
        >
          {ROLE_LABELS[role]}
        </Button>
      ))}
    </div>
  </div>
);

const SignUpSection = ({
  roles,
  onSelect,
}: {
  roles: number[];
  onSelect: OnSelectRole;
}) => (
  <div className="flex justify-end items-center flex-col">
    <p className="text-white capitalize text-3xl text-center">Sign Up with</p>
    <div className="mt-4 flex gap-4 justify-center">
      {roles.map((role) => (
        <Button
          className="bg-white text-xl uppercase text-gray-800 px-8 py-4"
          key={role}
          onClick={onSelect({
            role,
            url: ROLE_REGISTRATION_URLS[role],
            roleType: ROLES.VISITOR,
          })}
        >
          {ROLE_LABELS[role]}
        </Button>
      ))}
    </div>
  </div>
);

const AppLoading: NextPage = () => {
  const {
    userInfo: { data: userInfoData, error },
  } = useUserInfo();
  const { account } = useAccount();
  const dispatch = useAppDispatch();
  const getUserDetail = useOwnedUserDetail();
  const router = useRouter();
  const initialize = useInitializeApp();
  const otherRoles = useMemo(
    () =>
      userInfoData
        ? ALL_ROLES.filter(
            (role) =>
              !userInfoData.nftIdentities.some(
                ({ role: userRole }) => role === userRole
              ) &&
              !userInfoData.registrationInfos.some(
                ({ role: registeredRole }) => role === registeredRole
              )
          )
        : [],
    [userInfoData]
  );

  const onSelectRole =
    (params: { roleType: number; role: number; url: Route }) => () =>
      getUserDetail({
        ...params,
        account: account.data,
      });

  useEffect(() => {
    if (userInfoData && account) {
      if (userInfoData.isOwner) {
        getUserDetail({
          ...userInfoData,
          account: account?.data,
          role: ROLES.COUNCIL,
          roleType: ROLES.COUNCIL,
        });
      } else {
        const { isOwner, ...updatedUser } = userInfoData;
        dispatch(updateUser(updatedUser));
      }
    }
  }, [userInfoData, account]);

  useEffect(() => {
    initialize();
    if (router.pathname !== '/') {
      router.replace('/');
    }
  }, []);

  if (account.isLoading) {
    return (
      <Loading width={64} height={64} className="text-white dark:text-white" />
    );
  }

  if (!account.isInstalled) {
    return (
      <CircleLink
        className="flex justify-center items-center flex-col bg-indigo-800 text-white text-2xl pt-6 w-[320px] h-[320px]"
        href="https://metamask.io"
        target="_blank"
      >
        Install Web3 Wallet
        <MetaMaskIcon className="w-[40%]" />
      </CircleLink>
    );
  }

  if (!account.data) {
    return (
      <CircleButton
        className="font-medium bg-indigo-800 text-white text-2xl pt-6 px-4 py-2 w-[320px] h-[320px]"
        type="button"
        onClick={() => account.connect()}
      >
        CONNECT WALLET
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1"
          stroke="currentColor"
          className="text-white w-[40%] h-[40%] mx-auto"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
          />
        </svg>
      </CircleButton>
    );
  }

  if (!userInfoData) {
    return (
      <CircleBox className="flex text-center items-center justify-center uppercase font-medium text-2xl px-4 py-2 w-[320px] h-[320px] bg-indigo-800 text-white">
        Loading...
      </CircleBox>
    );
  }

  return (
    <div className="flex gap-[80px] flex-wrap items-start">
      {userInfoData.registrationInfos.length > 0 && (
        <RegistrationSection
          registrationInfos={userInfoData.registrationInfos}
          onSelect={onSelectRole}
        />
      )}
      {userInfoData.nftIdentities.length > 0 && (
        <SignInSection
          nftIdentities={userInfoData.nftIdentities}
          onSelect={onSelectRole}
        />
      )}
      {otherRoles.length > 0 && (
        <SignUpSection roles={otherRoles} onSelect={onSelectRole} />
      )}
    </div>
  );
};

export default AppLoading;
