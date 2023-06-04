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
import { formatDate } from 'utils';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { openConfirmModal } from '@store/appSlice';
import {
  useNftCompleteCourseListApi,
  useNftCompleteCourseListGroupApi,
  useNftRegistrationClassListApi,
} from '@hooks/api/classes';
import {
  NftClassRegistrationDetailModal,
  NftCompleteCourseDetailModal,
} from '@templates/Modal';
import { useModalController } from '@hooks/ui';
import { useState } from 'react';
import { selectCurrentNftIdentity } from '@store/userSlice';
import { useRequestCompleteCourseCertificate } from '@hooks/common';
import { knowledgeBlockEntity, userEntity } from 'domain/models';
import { KnowledgeBlockEntityWithGain } from '@_types/api/certificates';

type ClassColumnProps = {
  item: NftClassRegistrationEntityWithApproveStatus;
  onOpenNftModal: (nft: NftClassRegistrationEntityWithApproveStatus) => void;
};

const { DATE_TIME } = CONST;

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
    custom: ({ item }: ClassColumnProps) => <p>{item.class.credits}</p>,
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
      const dispatch = useAppDispatch();
      const requestCompleteCourseCertificate =
        useRequestCompleteCourseCertificate();

      const onRequestCompleteCourseCertificate = () => {
        dispatch(
          openConfirmModal({
            type: 'warning',
            header: 'Chú ý',
            content: (
              <>
                <p>
                  Hãy chắc chắn bạn đã hoàn tất khóa học trước khi yêu cầu chứng
                  chỉ!
                </p>
                <p>
                  Thao tác này sẽ thu hồi NFT đăng ký môn học và đổi thành NFT
                  hoàn tất khóa học khi giảng viên đã kiểm chứng!
                </p>
              </>
            ),
            onAccept: () => requestCompleteCourseCertificate(item),
          })
        );
      };

      const openModal = () => onOpenNftModal(item);

      return (
        <div className="flex flex-col gap-[8px]">
          <Button onClick={openModal} theme="sub">
            Xem NFT
          </Button>

          <Button
            onClick={onRequestCompleteCourseCertificate}
            className="bg-indigo-900 px-2 py-1 text-white rounded-[4px]  w-[120px]"
            disabled={item.isApprovedSent || item.isRegained}
            disabledTag={
              item.isApprovedSent ? 'Đã gửi yêu cầu' : 'Đang xử lý...'
            }
            customTagClassName="min-w-[120px] px-2 py-1"
          >
            Yều cầu cấp chứng chỉ
          </Button>
        </div>
      );
    },
  },
];

export const StudentProfile = () => {
  const { tokenId } = useAppSelector(selectCurrentNftIdentity);
  const { data: registeredClasses = [] } = useNftRegistrationClassListApi(
    {
      tokenId,
      isRegained: 0,
    },
    {
      withApproveSent: true,
    }
  );
  const {
    data: knowledgeBlocks = knowledgeBlockEntity.createDefaultKnowledgeBlockList(),
  } = useNftCompleteCourseListGroupApi({
    studentTokenId: tokenId,
  });
  const [isNFTModalOpen, openNftModal, closeNFTModal] = useModalController();
  const [nftClassRegistrationDetail, setNftClassRegistrationDetail] =
    useState<NftClassRegistrationEntity | null>(null);
  const totalRequiredCredits = knowledgeBlockEntity.getTotalRequiredCredits(
    knowledgeBlocks.list as KnowledgeBlockEntity[]
  );
  const canRequestGraduation = knowledgeBlockEntity.checkCanGraduate(knowledgeBlocks);
  const onOpenNftModal = (nftClassRegistration: NftClassRegistrationEntity) => {
    openNftModal();
    setNftClassRegistrationDetail(nftClassRegistration);
  };
  const onCloseNftModal = () => {
    closeNFTModal();
    setNftClassRegistrationDetail(null);
  };

  return (
    <>
      <Heading>Thông tin học tập</Heading>

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

            <LinkBox
              className="inline-block ml-auto"
              href={ROUTES.requestGraduation.name}
              theme="main"
              disabledContainerClassName="inline-block ml-auto"
              disabled={canRequestGraduation}
            >
              Yêu cầu xét tốt nghiệp
            </LinkBox>
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
