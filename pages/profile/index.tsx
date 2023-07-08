import type { NextPage } from 'next';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import moment from 'moment';

import CONST from '@config/constants.json';
import { selectCurrentNftIdentity, selectUser } from '@store/userSlice';
import { InputField, LinkField } from '@molecules';
import { RegistrationDetail, Table } from '@organisms';
import { BaseLayout } from '@templates';
import { TeacherProfile, StudentProfile } from '@templates';
import { useMemo } from 'react';
import { Heading, LinkBox } from '@atoms';

const { ROLES } = CONST;

const Profile: NextPage = () => {
  const nftIdentity = useSelector(selectCurrentNftIdentity);
  const { roleType: role } = useSelector(selectUser);

  const MoreInfo = useMemo(
    () => (
      <div className="mb-8">
        <Heading>Thông tin NFT</Heading>
        <div className="grid grid-cols-2 gap-4 gap-x-8 mt-4">
          <InputField label="Token ID" value={nftIdentity.tokenId} readOnly />
          <InputField
            label="Ngày đăng ký"
            value={moment(nftIdentity.meta.registerDate).format(
              'DD/MM/YYYY HH:mm:ss'
            )}
            readOnly
          />
          <InputField
            label="Ngày cấp"
            value={moment(nftIdentity.meta.approveDate).format(
              'DD/MM/YYYY HH:mm:ss'
            )}
            readOnly
          />
          <InputField
            label="Ngày hết hạn"
            value={moment(nftIdentity.expiredAt).format('DD/MM/YYYY HH:mm:ss')}
            readOnly
          />
        </div>
        <LinkField
          containerClassName="mt-4"
          label="Metadata"
          href={nftIdentity.tokenURI}
          text={nftIdentity.tokenURI}
          target="_blank"
          theme="disabled"
        />
      </div>
    ),
    [nftIdentity]
  );

  return (
    <BaseLayout>
      <RegistrationDetail registration={nftIdentity.meta} more={MoreInfo} />

      {role === ROLES.TEACHER ? <TeacherProfile /> : <StudentProfile />}
    </BaseLayout>
  );
};
Profile.displayName = 'Profile';

export default Profile;
