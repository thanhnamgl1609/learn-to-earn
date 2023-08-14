import { FC, memo } from 'react';

import {
  ClassEntity,
  NftCompleteCourseEntity,
} from '@_types/models/entities';
import { Box, InputField, LinkField } from '@molecules';
import { Heading } from '@atoms';
import { nftCompleteCourseEntity } from 'domain/models';

type Props = {
  nftCompleteCourse: NftCompleteCourseEntity | null;
};

export const NftCompleteCourseDetail: FC<Props> = memo(
  ({ nftCompleteCourse }) => {
    if (!nftCompleteCourse) return <></>;

    return (
      <Box autoLayout>
        <Heading className="px-6 pt-4">
          NFT đăng ký môn học #{nftCompleteCourse.tokenId}
        </Heading>
        <InputField
          label="Mã môn học"
          value={nftCompleteCourse.class.courseCode}
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
          value={nftCompleteCourseEntity.displayGrantDate(
            nftCompleteCourse
          )}
          readOnly
        />
        <LinkField
          label="Metadata"
          href={nftCompleteCourse.chainURI}
          target="_blank"
          text={nftCompleteCourse.chainURI}
        />
      </Box>
    );
  }
);
