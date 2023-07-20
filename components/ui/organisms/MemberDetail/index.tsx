import { Heading, Image } from '@atoms';
import { Box, InputField, LinkField, ProfileImage } from '@molecules';
import { RegistrationInfoMeta } from '@_types/nftIdentity';
import { FC, memo, PropsWithChildren } from 'react';
import { formatDate } from 'utils';
import CONST from 'config/constants.json';
import { UserEntity } from '@_types/models/entities';

type Props = {
  user: UserEntity;
};

const {
  UI: { INPUT_DATE_FORMAT },
  DATE_TIME,
} = CONST;

const MemberDetail: FC<PropsWithChildren<Props>> = ({
  user,
  children,
}) => (
  <Box className="relative p-6 pt-[80px]">
    <ProfileImage
      fullName={user.fullName}
      image={user.profileImage}
      className="absolute z-[1] top-0 translate-y-[-25%]"
    />

    <div className="mb-8">
      <Heading>Thông tin NFT</Heading>
      <div className="grid grid-cols-2 gap-4 gap-x-8 mt-4">
        <InputField label="Token ID" value={user.tokenId} readOnly />
        <InputField
          label="Ngày đăng ký"
          value={formatDate(user.registerDate, DATE_TIME.SLASH_DATE)}
          readOnly
        />
        <InputField
          label="Ngày cấp"
          value={formatDate(user.approveDate, DATE_TIME.SLASH_DATE)}
          readOnly
        />
        <InputField
          label="Ngày hết hạn"
          value={formatDate(user.expiredAt, DATE_TIME.SLASH_DATE)}
          readOnly
        />
      </div>

      <LinkField
        containerClassName="mt-4"
        label="Metadata"
        href={user.chainURI}
        text={user.chainURI}
        target="_blank"
        theme="disabled"
      />
    </div>

    <Heading>Thông tin cơ bản</Heading>
    <div className="grid grid-cols-2 gap-4 gap-x-8 mt-4">
      <InputField
        value={user.gender === 0 ? 'Nam' : 'Nữ'}
        label="Giới tính"
        readOnly
      />
      <InputField
        value={formatDate(user.dateOfBirth, INPUT_DATE_FORMAT)}
        type="date"
        label="Ngày sinh"
        placeholder="Nhập ngày tháng năm sinh"
        readOnly
      />
      <InputField
        value={user.personalEmail}
        label="Email cá nhân"
        readOnly
      />
      <InputField
        value={user.identityNumber}
        label="Số CMND/CCCD"
        placeholder="Nhập số CMND/CCCD"
        readOnly
      />
      <InputField
        value={user.phone}
        label="Số Điện Thoại"
        placeholder="Nhập số điện thoại liên lạc"
        readOnly
      />
    </div>

    <h4 className="mt-4 mb-2 font-medium">Giấy tờ tùy thân</h4>
    <div className="grid grid-cols-1 md:grid-cols-2">
      {user.documentURIs.map(({ uri }) => (
        <Image src={uri} alt="" key={uri} canZoomIn />
      ))}
    </div>
    {children}
  </Box>
);

export default memo(MemberDetail);
