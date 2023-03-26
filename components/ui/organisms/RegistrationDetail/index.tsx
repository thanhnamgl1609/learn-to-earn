import { Image } from '@atoms';
import { Box } from '@molecules';
import { RegistrationInfoMeta } from '@_types/nftIdentity';
import { FC, memo } from 'react';

type Props = {
  registration: RegistrationInfoMeta;
};

const RegistrationDetail: FC<Props> = ({ registration }) => (
  <>
    <h3 className="text-lg font-medium leading-6 text-gray-900">
      {registration.fullName}
    </h3>
    <div>
      <h4 className="mb-2 font-medium">Documents</h4>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {registration.documentURIs.map((uri) => (
          <Image src={uri} alt="" key={uri} canZoomIn />
        ))}
      </div>
    </div>
  </>
);

export default memo(RegistrationDetail);
