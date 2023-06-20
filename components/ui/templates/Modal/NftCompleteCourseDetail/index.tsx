import { FC, memo } from 'react';

import { ClassEntity } from '@_types/models/entities';
import { Box, InputField, LinkField } from '@molecules';
import { Heading } from '@atoms';
import { nftCompleteCourseEntity } from 'domain/models';
import { Modal } from '../BaseModal';

type Props = {
  classInfo: ClassEntity | null;
  isOpen: boolean;
  onClose: () => void;
};

export const NftCompleteCourseDetailModal: FC<Props> = memo(
  ({ classInfo, isOpen, onClose }) => {
    if (!classInfo) return <></>;
    const {
      nftCompleteCourses: [nftCompleteCourse],
    } = classInfo;

    return (
      <Modal
        className="w-[640px] bg-white overflow-auto rounded"
        isOpen={isOpen}
        onClose={onClose}
      >
        <Heading className="px-6 pt-4">
          NFT đăng ký môn học #{nftCompleteCourse.tokenId}
        </Heading>

        <Box autoLayout>
          <InputField
            label="Mã môn học"
            value={classInfo.course.onChainId}
            readOnly
          />
          <InputField
            label="Tên môn học"
            value={classInfo.course.name}
            readOnly
          />
          <InputField
            label="Mã sinh viên"
            value={nftCompleteCourse.studentTokenId}
            readOnly
          />
          <InputField
            label="Tên sinh viên"
            value={nftCompleteCourse.student.fullName}
            readOnly
          />
          <InputField
            label="Ngày cấp"
            value={nftCompleteCourseEntity.displayGrantDate(nftCompleteCourse)}
            readOnly
          />
          <LinkField
            label="Metadata"
            href={nftCompleteCourse.chainURI}
            target="_blank"
            text={nftCompleteCourse.chainURI}
          />
        </Box>
      </Modal>
    );
  }
);
