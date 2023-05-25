import { FC, memo } from 'react';

import { NftClassRegistrationEntity } from '@_types/models/entities';
import { Box, InputField, LinkField } from '@molecules';
import { Heading } from '@atoms';
import { Modal } from '../BaseModal';

type Props = {
  nftClassRegistration: NftClassRegistrationEntity | null;
  isOpen: boolean;
  onClose: () => void;
};

export const NftClassRegistrationDetailModal: FC<Props> = memo(
  ({ nftClassRegistration, isOpen, onClose }) => {
    if (!nftClassRegistration) return <></>;

    return (
      <Modal
        className="w-[640px] bg-white overflow-auto rounded"
        isOpen={isOpen}
        onClose={onClose}
      >
        <Heading className="px-6 pt-4">
          NFT đăng ký môn học #{nftClassRegistration.tokenId}
        </Heading>

        <Box autoLayout>
          <InputField
            label="Mã môn học"
            value={nftClassRegistration.class.course.onChainId}
            readOnly
          />
          <InputField
            label="Tên môn học"
            value={nftClassRegistration.class.course.name}
            readOnly
          />
          <InputField
            label="Mã sinh viên"
            value={nftClassRegistration.studentTokenId}
            readOnly
          />
          <InputField
            label="Tên sinh viên"
            value={nftClassRegistration.student.fullName}
            readOnly
          />
          <LinkField
            label="Metadata"
            href={nftClassRegistration.chainURI}
            target="_blank"
            text={nftClassRegistration.chainURI}
          />
        </Box>
      </Modal>
    );
  }
);
