import { NextPage } from 'next';
import { useEffect, useMemo } from 'react';
import { useAppDispatch } from '@hooks/stores';
import { useAccount, useNetwork, useRoles } from '@hooks/web3';
import { updateState } from '@store/appSlice';
import { updateUser } from '@store/userSlice';
import { CircleButton, CircleLink, Loading } from '@atoms';
import CONST from '@config/constants.json';
import Link from 'next/link';
import MetaMaskIcon from './MetaMaskIcon';

const { ROLES, ROLE_LABELS } = CONST;
const ALL_ROLES = [ROLES.STUDENT, ROLES.TEACHER];

const AllRoleSelection = () => (
  <div>
    {ALL_ROLES.map((role) => (
      <div key={role}>{ROLE_LABELS[role]}</div>
    ))}
  </div>
);

const SpecificRoleSelection = ({ roles }: { roles: number[] }) => {
  const newRoles = useMemo(
    () => ALL_ROLES.filter((role) => !roles.includes(role)),
    [roles]
  );

  return (
    <div>
      <p> Sign in with </p>
      <div>
        {ALL_ROLES.map((role) => (
          <div key={role}>{ROLE_LABELS[role]}</div>
        ))}
      </div>
      {newRoles.length && (
        <>
          <p> or sign up with </p>
          <div>
            {newRoles.map((role) => (
              <div key={role}>{ROLE_LABELS[role]}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const AppLoading: NextPage = () => {
  const { roles } = useRoles();
  const { network } = useNetwork();
  const { account } = useAccount();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!roles.error && roles.data) {
      dispatch(
        updateUser({
          roles: roles.data,
        })
      );
      dispatch(updateState({ initialUser: true }));
    }
  }, [roles]);

  if (network.isLoading) {
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
        className="bg-indigo-800 text-white text-2xl pt-6 w-[320px] h-[320px]"
        onClick={account.connect}
      >
        CONNECT TO WALLET
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

  return roles.data?.length ? (
    <SpecificRoleSelection roles={roles.data} />
  ) : (
    <AllRoleSelection />
  );
};

export default AppLoading;
