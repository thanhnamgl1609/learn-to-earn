import { Image } from '@atoms';
import { Box, InputField, ProfileImage } from '@molecules';
import { RegistrationInfoMeta } from '@_types/nftIdentity';
import { FC, memo, PropsWithChildren } from 'react';
import { formatDate } from 'utils';
import CONST from 'config/constants.json';

type Props = {
  registration: RegistrationInfoMeta;
};

const { INPUT_DATE_FORMAT } = CONST.UI;

const RegistrationDetail: FC<PropsWithChildren<Props>> = ({
  children,
  registration,
}) => (
  <Box className="relative p-6 pt-[80px]">
    <ProfileImage
      fullName={registration.fullName}
      image={registration.profileImage}
      className="absolute z-[1] top-0 translate-y-[-25%]"
    />

    <h4 className="mb-2 font-medium">Documents</h4>
    <div className="grid grid-cols-1 md:grid-cols-2">
      {registration.documentURIs.map((uri) => (
        <Image src={uri} alt="" key={uri} canZoomIn />
      ))}
    </div>

    <div className="flex gap-4 flex-col mt-4">
      <InputField
        value={registration.gender === 0 ? 'Nam' : 'Nữ'}
        label="Giới tính"
        readOnly
      />
      <InputField
        value={formatDate(registration.dateOfBirth, INPUT_DATE_FORMAT)}
        type="date"
        label="Ngày sinh"
        placeholder="Nhập ngày tháng năm sinh"
        readOnly
      />
      <InputField
        value={registration.personalEmail}
        label="Email cá nhân"
        readOnly
      />
      <InputField
        value={registration.identityNumber}
        label="Số CMND/CCCD"
        placeholder="Nhập số CMND/CCCD"
        readOnly
      />
      <InputField
        value={registration.phone}
        label="Số Điện Thoại"
        placeholder="Nhập số điện thoại liên lạc"
        readOnly
      />
    </div>
    {children}
  </Box>
);

export default memo(RegistrationDetail);
