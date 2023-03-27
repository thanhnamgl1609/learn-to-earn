import { Image } from '@atoms';
import { Box, ProfileImage } from '@molecules';
import { RegistrationInfoMeta } from '@_types/nftIdentity';
import { FC, memo, PropsWithChildren } from 'react';

type Props = {
  registration: RegistrationInfoMeta;
};

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

    {children}
  </Box>
);

export default memo(RegistrationDetail);
