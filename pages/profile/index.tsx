/* eslint-disable @next/next/no-img-element */

import moment from 'moment';
import { InputField } from '@molecules';
import { RegistrationDetail } from '@organisms';
import { selectUser } from '@store/userSlice';
import { BaseLayout } from '@templates';
import { TeacherMeta } from '@_types/nftIdentity';
import type { NextPage } from 'next';
import { useSelector } from 'react-redux';

const Profile: NextPage = () => {
  const user = useSelector(selectUser);

  return (
    <BaseLayout>
      <RegistrationDetail registration={user.nftIdentity.meta as TeacherMeta}>
        <InputField
          containerClassName="mt-4"
          label="Token ID"
          value={user.nftIdentity.tokenId}
          readOnly
        />
        <InputField
          containerClassName="mt-4"
          label="Expired At"
          value={moment(user.nftIdentity.expiredAt).format(
            'DD/MM/YYYY HH:mm:ss'
          )}
          readOnly
        />
      </RegistrationDetail>
    </BaseLayout>
  );
};

export default Profile;
