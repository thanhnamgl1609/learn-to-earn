/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next';
import { Modal } from '@templates/Modal';

const Home: NextPage = () => {
  return <Modal isOpen={true}>Hello world</Modal>;
};
Home.displayName = 'Home';

export default Home;
