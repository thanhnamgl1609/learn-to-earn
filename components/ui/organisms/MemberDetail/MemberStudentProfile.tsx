import _ from 'lodash';

import {
  KnowledgeBlockEntity,
  UserEntity,
} from '@_types/models/entities';
import { NftClassRegistrationEntityWithApproveStatus } from '@_types/api/class';
import CONST from '@config/constants.json';
import ROUTES from 'config/routes.json';
import { Box, InputField } from '@molecules';
import { Button, Heading, LinkBox } from '@atoms';
import { formatDate, cls } from 'utils';
import { useAppSelector } from '@hooks/stores';
import { useNftCompleteCourseListGroupApi } from '@hooks/api/classes';
import { FC, memo } from 'react';
import { selectCurrentNftIdentity } from '@store/userSlice';
import { knowledgeBlockEntity } from 'domain/models';
import Table from '../Table';

type Props = {
  user: UserEntity;
};

type ClassColumnProps = {
  item: NftClassRegistrationEntityWithApproveStatus;
  onOpenNftModal: (
    nft: NftClassRegistrationEntityWithApproveStatus
  ) => void;
  onExchangeSuccess: () => Promise<void>;
};

const { DATE_TIME } = CONST;

const classTableHeaders = [
  {
    field: 'tokenId',
    name: 'Token ID',
    textCenter: true,
  },
  {
    field: 'class.course.name',
    name: 'Tên môn học',
  },
  {
    field: 'class.knowledgeBlock.name',
    name: 'Khối kiến thức',
    hideOnTablet: true,
  },
  {
    field: 'class.credits',
    name: 'Số tín chỉ',
    custom: ({ item }: ClassColumnProps) => (
      <p>{item.class.credits}</p>
    ),
    textCenter: true,
  },
  {
    name: 'Ngày bắt đầu môn học',
    custom: ({ item }: ClassColumnProps) => (
      <p>{formatDate(item.class.startAt, DATE_TIME.DATETIME)}</p>
    ),
    hideOnTablet: true,
    textCenter: true,
  },
  {
    name: 'Ngày kết thúc môn học',
    custom: ({ item }: ClassColumnProps) => (
      <p>{formatDate(item.class.completeAt, DATE_TIME.DATETIME)}</p>
    ),
    hideOnTablet: true,
    textCenter: true,
  },
  {
    field: 'class.teacher.fullName',
    name: 'Giảng viên',
    hideOnTablet: true,
    textCenter: true,
  },
  {
    name: 'Điểm số',
    custom: ({ item }: ClassColumnProps) => (
      <p>{item.score === null ? 'Chưa cập nhật' : item.score}</p>
    ),
    textCenter: true,
  },
];

const MemberStudentProfile: FC<Props> = ({ user }) => {
  const {
    data: knowledgeBlocks = knowledgeBlockEntity.createDefaultKnowledgeBlockList(),
  } = useNftCompleteCourseListGroupApi({
    studentTokenId: user.tokenId,
  });
  const totalRequiredCredits =
    knowledgeBlockEntity.getTotalRequiredCredits(
      knowledgeBlocks.list as KnowledgeBlockEntity[]
    );
  const { nftCompleteCourses = [] } = user;
  const isGraduated = !!user.nftGraduation;

  return (
    <>
      <Heading>
        Thông tin học tập{' '}
        <span
          className={cls(
            'cursor-default ml-4 inline-block border rounded-xl text-sm px-4 py-2 text-white',
            isGraduated && ' bg-indigo-800',
            !isGraduated && 'bg-gray-400'
          )}
        >
          {isGraduated ? 'Đã tốt nghiệp' : 'Chưa tốt nghiệp'}
        </span>
      </Heading>

      <Box className="px-8 py-6" autoLayout>
        <div className="flex gap-8 items-center">
          <Heading>Kết quả học tập</Heading>
        </div>

        <div className="grid grid-cols-2 gap-x-[80px]">
          <div className="flex gap-4 flex-col">
            <InputField
              containerClassName="flex items-center gap-[24px]"
              className="mt-0 flex-1"
              labelClassName="min-w-[200px]"
              label="Điểm TB tích lũy"
              value={knowledgeBlocks.avgScore ?? 0}
              disabled
            />

            <InputField
              containerClassName="flex items-center gap-[24px]"
              className="mt-0 flex-1"
              labelClassName="min-w-[200px]"
              label="Tổng TC tích lũy"
              value={`${knowledgeBlocks.totalCredits} / ${totalRequiredCredits}`}
              disabled
            />

            {isGraduated && (
              <LinkBox
                className="inline-block ml-auto"
                href={ROUTES.myGraduationDetail.name}
                theme="main"
              >
                Xem NFT tốt nghiệp
              </LinkBox>
            )}
          </div>

          <div className="space-y-4">
            {knowledgeBlocks.list.map((knowledgeBlock) => (
              <InputField
                key={knowledgeBlock.onChainId}
                containerClassName="flex items-center gap-[24px]"
                labelClassName="min-w-[200px]"
                className="mt-0 flex-1"
                label={knowledgeBlock.name}
                value={`${knowledgeBlock.totalCredits} / ${knowledgeBlock.credits}`}
                disabled
              />
            ))}
          </div>
        </div>
      </Box>

      <Box className="px-8 py-6" autoLayout>
        <Heading>Môn học đã hoàn thành</Heading>
        <Table
          headers={classTableHeaders}
          data={nftCompleteCourses}
          fullWidth
        />
      </Box>
    </>
  );
};

export default memo(MemberStudentProfile);
