/* eslint-disable @next/next/no-img-element */

import { selectUser } from '@store/userSlice';
import { BaseLayout } from '@templates';
import type { NextPage } from 'next';
import { useSelector } from 'react-redux';

const Profile: NextPage = () => {
  const user = useSelector(selectUser);
  console.log("🚀 ~ file: index.tsx:17 ~ user:", user)


  return (
    <BaseLayout>
    </BaseLayout>
  );
};

export default Profile;
