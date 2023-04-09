import type { NextPage } from 'next';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { withAuth } from '@hooks/routes';
import { selectCurrentNftIdentity } from '@store/userSlice';
import { InputField } from '@molecules';
import { RegistrationDetail } from '@organisms';
import { BaseLayout } from '@templates';

const Profile: NextPage = () => {
  const nftIdentity = useSelector(selectCurrentNftIdentity);

  return (
    <BaseLayout>
      <RegistrationDetail registration={nftIdentity.meta}>
        <InputField
          containerClassName="mt-4"
          label="Token ID"
          value={nftIdentity.tokenId}
          readOnly
        />
        <InputField
          containerClassName="mt-4"
          label="Expired At"
          value={moment(nftIdentity.expiredAt).format('DD/MM/YYYY HH:mm:ss')}
          readOnly
        />
      </RegistrationDetail>
    </BaseLayout>
  );
};
Profile.displayName = 'Profile';

export default Profile;
