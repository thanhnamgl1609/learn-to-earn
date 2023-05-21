/* eslint-disable @next/next/no-img-element */

import React, { memo, useMemo } from 'react';
import { useRouter } from 'next/router';

import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { useAccount, useNetwork } from '@hooks/web3';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { selectUser, updateUser } from '@store/userSlice';
import { ActiveLink, Button } from '@atoms';
import { WalletBar } from '@molecules';
import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';

const { ROLES } = CONST;

const navigation = {
  [ROLES.TEACHER]: [],
  [ROLES.STUDENT]: [
    {
      current: true,
      name: 'Home',
      href: ROUTES.school.name,
    },
  ],
  [ROLES.VISITOR]: [],
  [ROLES.REGISTERED]: [],
  [ROLES.COUNCIL]: [],
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function Navbar() {
  const { account } = useAccount();
  const { network } = useNetwork();
  const dispatch = useAppDispatch();
  const { roleType: role, detail } = useAppSelector(selectUser);

  const navItems = useMemo(() => (role || role === 0 ? navigation[role] : []), [role]);
  const onSignOut = () => {
    dispatch(updateUser({ role: null, roleType: null }));
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="hidden lg:block h-10 w-auto"
                    src="/images/page_logo.png"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navItems.map((item) => (
                      <ActiveLink
                        key={item.name}
                        href={item.href}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        activeClass="bg-gray-900 text-white"
                      >
                        {item.name}
                      </ActiveLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="text-gray-300 self-center mr-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                    <svg
                      className="-ml-0.5 mr-1.5 h-2 w-2 text-indigo-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    {network.isLoading
                      ? 'Loading...'
                      : account.isInstalled
                      ? network.data
                      : 'Install Web3 Wallet'}
                  </span>
                </div>

                {account.data && (
                  <WalletBar role={role} account={account.data} detail={detail} />
                )}

                {role !== ROLES.COUNCIL && (
                  <Button
                    size="S"
                    className="self-center ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-black"
                    onClick={onSignOut}
                  >
                    Sign out
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default memo(Navbar);
