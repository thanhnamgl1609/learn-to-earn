import _ from 'lodash';

import {
  KnowledgeBlockEntity,
  NftClassRegistrationEntity,
} from '@_types/models/entities';
import { NftClassRegistrationEntityWithApproveStatus } from '@_types/api/class';
import CONST from '@config/constants.json';
import ROUTES from 'config/routes.json';
import { Box, InputField } from '@molecules';
import { Table } from '@organisms';
import { Button, Heading, LinkBox } from '@atoms';
import { formatDate, cls } from 'utils';
import { useAppSelector } from '@hooks/stores';
import {
  useNftCompleteCourseListGroupApi,
  useNftRegistrationClassListApi,
} from '@hooks/api/classes';
import { NftClassRegistrationDetailModal } from '@templates/Modal';
import { useModalController } from '@hooks/ui';
import { useCallback, useMemo, useState } from 'react';
import {
  selectCurrentNftIdentity,
  selectUserDetail,
} from '@store/userSlice';
import { useExchangeNftCompleteCourse } from '@hooks/common';
import { knowledgeBlockEntity } from 'domain/models';

type ClassColumnProps = {
  item: NftClassRegistrationEntityWithApproveStatus;
  onOpenNftModal: (
    nft: NftClassRegistrationEntityWithApproveStatus
  ) => void;
};

const { DATE_TIME, REQUEST_STATUS, REQUEST_STATUS_TEXT } = CONST;

const classTableHeaders = [
  {
    field: 'class.onChainId',
    name: 'Mã lớp học',
  },
  {
    field: 'class.course.name',
    name: 'Tên môn học',
  },
  {
    field: 'class.knowledgeBlock.name',
    name: 'Khối kiến thức',
  },
  {
    field: 'class.credits',
    name: 'Số tín chỉ',
    custom: ({ item }: ClassColumnProps) => (
      <p>{item.class.credits}</p>
    ),
  },
  {
    field: 'class.numberOfStudents',
    name: 'Số sinh viên',
  },
  {
    name: 'Ngày bắt đầu môn học',
    custom: ({ item }: ClassColumnProps) => (
      <p>{formatDate(item.class.startAt, DATE_TIME.DATETIME)}</p>
    ),
  },
  {
    name: 'Ngày kết thúc môn học',
    custom: ({ item }: ClassColumnProps) => (
      <p>{formatDate(item.class.completeAt, DATE_TIME.DATETIME)}</p>
    ),
  },
  {
    field: 'class.teacher.fullName',
    name: 'Giảng viên',
  },
  {
    name: 'Hành động',
    custom: ({ item, onOpenNftModal }: ClassColumnProps) => {
      const exchangeNftCompleteCourse =
        useExchangeNftCompleteCourse();
      const onExchangeNftCompleteCourse = useCallback(
        () => exchangeNftCompleteCourse(item),
        [item]
      );

      const openModal = () => onOpenNftModal(item);
      const disabledText = 'Không đủ điểm';

      return (
        <div className="flex flex-col gap-[8px]">
          <Button onClick={openModal} theme="sub">
            Xem NFT
          </Button>

          {(item.score || item.score === 0) && (
            <Button
              onClick={onExchangeNftCompleteCourse}
              className="bg-indigo-900 px-2 py-1 text-white rounded-[4px]  w-[120px]"
              customTagClassName="min-w-[120px] px-2 py-1"
              disabled={!item.isExchangeable}
              disabledTag={disabledText}
            >
              Đổi chứng chỉ
            </Button>
          )}
        </div>
      );
    },
  },
];

export const StudentProfile = () => {
  const detail = useAppSelector(selectUserDetail);
  const { tokenId } = useAppSelector(selectCurrentNftIdentity);
  const { data: registeredClasses = [] } =
    useNftRegistrationClassListApi({
      tokenId,
      isRegained: 0,
    });
  const {
    data: knowledgeBlocks = knowledgeBlockEntity.createDefaultKnowledgeBlockList(),
  } = useNftCompleteCourseListGroupApi({
    studentTokenId: tokenId,
  });
  const [isNFTModalOpen, openNftModal, closeNFTModal] =
    useModalController();
  const [nftClassRegistrationDetail, setNftClassRegistrationDetail] =
    useState<NftClassRegistrationEntity | null>(null);
  const { requestGraduation } = detail;
  const totalRequiredCredits =
    knowledgeBlockEntity.getTotalRequiredCredits(
      knowledgeBlocks.list as KnowledgeBlockEntity[]
    );
  const isGraduated = !!detail.nftGraduation;
  const isRequestPending =
    requestGraduation?.status === REQUEST_STATUS.PENDING;
  const canRequestGraduation =
    knowledgeBlockEntity.checkCanGraduate(knowledgeBlocks);
  const requestStatusText = useMemo(() => {
    if (!requestGraduation) {
      return 'Chưa có';
    }

    return REQUEST_STATUS_TEXT[requestGraduation.status];
  }, [requestGraduation]);
  const onOpenNftModal = (
    nftClassRegistration: NftClassRegistrationEntity
  ) => {
    openNftModal();
    setNftClassRegistrationDetail(nftClassRegistration);
  };
  const onCloseNftModal = () => {
    closeNFTModal();
    setNftClassRegistrationDetail(null);
  };

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
        <Heading>Môn học đã đăng ký</Heading>
        <Table
          headers={classTableHeaders}
          data={registeredClasses}
          customProps={{ onOpenNftModal }}
        />
      </Box>

      <Box className="px-8 py-6" autoLayout>
        <div className="flex gap-8 items-center">
          <Heading>Kết quả học tập</Heading>
          <LinkBox href={ROUTES.selfCompleteCourse.name} theme="main">
            Xem chi tiết
          </LinkBox>
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

            <InputField
              containerClassName="flex items-center gap-[24px]"
              className="mt-0 flex-1"
              labelClassName="min-w-[200px]"
              label="Tình trạng xét tốt nghiệp"
              value={requestStatusText}
              disabled
            />

            {isGraduated ? (
              <LinkBox
                className="inline-block ml-auto"
                href={ROUTES.myGraduationDetail.name}
                theme="main"
              >
                Xem NFT tốt nghiệp
              </LinkBox>
            ) : (
              <>
                {!isRequestPending && (
                  <LinkBox
                    className="inline-block ml-auto"
                    href={ROUTES.requestGraduation.name}
                    theme="main"
                    disabledContainerClassName="inline-block ml-auto"
                    disabled={!canRequestGraduation}
                  >
                    Yêu cầu xét tốt nghiệp
                  </LinkBox>
                )}

                {requestGraduation && (
                  <LinkBox
                    className="inline-block ml-auto"
                    href={ROUTES.myRequestGraduation.name}
                    theme="main"
                  >
                    Xem yêu cầu xét tốt nghiệp
                  </LinkBox>
                )}
              </>
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

      <NftClassRegistrationDetailModal
        isOpen={isNFTModalOpen}
        onClose={onCloseNftModal}
        nftClassRegistration={nftClassRegistrationDetail}
      />
    </>
  );
};
