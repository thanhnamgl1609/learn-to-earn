/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { FunctionComponent } from 'react';
import { Menu } from '@headlessui/react';
import CONST from '@config/constants.json';

type WalletBarProps = {
  role: number;
  account: string;
};

const { ROLES } = CONST;

const LINKS = {
  [ROLES.TEACHER]: [
    {
      label: 'Profile',
      url: '/profile',
    },
  ],
  [ROLES.STUDENT]: [
    {
      label: 'Profile',
      url: '/profile',
    },
  ],
  [ROLES.VISITOR]: [],
  [ROLES.REGISTERED]: [],
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const WalletBar: FunctionComponent<WalletBarProps> = ({ role, account }) => (
  <Menu as="div" className="ml-3 relative">
    <div>
      <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
        <span className="sr-only">Open user menu</span>
        <img
          className="h-8 w-8 rounded-full"
          src="/images/default_user_image.png"
          alt=""
        />
      </Menu.Button>
    </div>

    <Menu.Items className="z-10 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
      <Menu.Item>
        {() => (
          <button
            disabled={true}
            className="disabled:text-gray-500 text-xs block px-4 pt-2 text-gray-700"
          >
            {`0x${account.slice(2, 5)}....${account.slice(-4)}`}
          </button>
        )}
      </Menu.Item>
      {(LINKS[role] || []).map(({ label, url }) => (
        <Menu.Item>
          {({ active }) => (
            <Link
              href={url}
              className={classNames(
                active ? 'bg-gray-100' : '',
                'block px-4 py-2 text-sm text-gray-700'
              )}
            >
              {label}
            </Link>
          )}
        </Menu.Item>
      ))}
    </Menu.Items>
  </Menu>
);

export default WalletBar;
