import type { NextPage } from 'next';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import moment from 'moment';

import CONST from '@config/constants.json';
import { selectCurrentNftIdentity, selectUser } from '@store/userSlice';
import { InputField } from '@molecules';
import { RegistrationDetail, Table } from '@organisms';
import { BaseLayout } from '@templates';
import { TeacherProfile, StudentProfile } from '@templates';

const { ROLES } = CONST;

const Profile: NextPage = () => {
  const nftIdentity = useSelector(selectCurrentNftIdentity);
  const { roleType: role } = useSelector(selectUser);

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
          label="Ngày đăng ký"
          value={moment(nftIdentity.meta.registerDate).format(
            'DD/MM/YYYY HH:mm:ss'
          )}
          readOnly
        />
        <InputField
          containerClassName="mt-4"
          label="Ngày cấp"
          value={moment(nftIdentity.meta.approveDate).format(
            'DD/MM/YYYY HH:mm:ss'
          )}
          readOnly
        />
        <InputField
          containerClassName="mt-4"
          label="Ngày hết hạn"
          value={moment(nftIdentity.expiredAt).format('DD/MM/YYYY HH:mm:ss')}
          readOnly
        />
      </RegistrationDetail>

      {role === ROLES.TEACHER ? <TeacherProfile /> : <StudentProfile />}
    </BaseLayout>
  );
};
Profile.displayName = 'Profile';

export default Profile;
