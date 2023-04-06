/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next';
import { BaseLayout, Modal } from '@templates';
import { useNetwork } from '@hooks/web3';
import { withAuth } from '@hooks/routes';

const Home: NextPage = () => {
  return <Modal isOpen={true}>Hello world</Modal>;
};

export default withAuth(Home);
