import _ from 'lodash';

import {
  NftClassRegistrationEntity,
  NftCompleteCourseEntity,
} from '@_types/models/entities';
import { NftClassRegistrationEntityWithApproveStatus } from '@_types/api/class';
import CONST from '@config/constants.json';
import { Box, InputField } from '@molecules';
import { Table } from '@organisms';
import { Button, Heading } from '@atoms';
import { formatDate } from 'utils';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { openConfirmModal } from '@store/appSlice';
import {
  useNftCompleteCourseListApi,
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

type ClassColumnProps = {
  item: NftClassRegistrationEntityWithApproveStatus;
  onOpenNftModal: (nft: NftClassRegistrationEntityWithApproveStatus) => void;
};

type CompleteCourseColumnProps = {
  item: NftCompleteCourseEntity;
  onOpenNftCompleteCourseModal: (nft: NftCompleteCourseEntity) => void;
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

const completeCourseTableHeaders = [
  {
    field: 'tokenId',
    name: 'Token Id',
  },
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
  },
  {
    name: 'Ngày cấp',
    custom: ({ item }: CompleteCourseColumnProps) => (
      <p>{formatDate(item.grantDate, DATE_TIME.DATETIME)}</p>
    ),
  },
  {
    field: 'avgScore',
    name: 'Điểm trung bình',
  },
  {
    field: 'class.teacher.fullName',
    name: 'Giảng viên',
  },
  {
    name: 'Hành động',
    custom: ({
      item,
      onOpenNftCompleteCourseModal,
    }: CompleteCourseColumnProps) => (
      <div className="flex flex-col gap-[8px]">
        <Button onClick={() => onOpenNftCompleteCourseModal(item)} theme="sub">
          Xem NFT
        </Button>
      </div>
    ),
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
    data: { list: completeCourseList = [], totalAvgScore, totalCredits } = {},
  } = useNftCompleteCourseListApi({
    studentTokenId: tokenId,
  });
  const [isNFTModalOpen, openNftModal, closeNFTModal] = useModalController();
  const [
    isNftCompleteCourseModal,
    openNftCompleteCourseModal,
    closeNftCompleteCourseModal,
  ] = useModalController();
  const [nftClassRegistrationDetail, setNftClassRegistrationDetail] =
    useState<NftClassRegistrationEntity | null>(null);
  const [nftCompleteCourseDetail, setNftCompleteCourseDetail] =
    useState<NftCompleteCourseEntity | null>(null);
  const onOpenNftModal = (nftClassRegistration: NftClassRegistrationEntity) => {
    openNftModal();
    setNftClassRegistrationDetail(nftClassRegistration);
  };
  const onCloseNftModal = () => {
    closeNFTModal();
    setNftClassRegistrationDetail(null);
  };

  const onOpenNftCompleteCourseModal = (
    nftCompleteCourse: NftCompleteCourseEntity
  ) => {
    openNftCompleteCourseModal();
    setNftCompleteCourseDetail(nftCompleteCourse);
  };

  const onCloseNftCompleteCourseModal = () => {
    openNftCompleteCourseModal();
    setNftCompleteCourseDetail(null);
  };

  return (
    <>
      <Box className="px-8 py-6" autoLayout>
        <Heading>Môn học đã đăng ký</Heading>
        <Table
          headers={classTableHeaders}
          data={registeredClasses}
          customProps={{ onOpenNftModal }}
        />
      </Box>

      <Box className="px-8 py-6" autoLayout>
        <Heading>Môn học đã hoàn thành</Heading>

        <InputField
          containerClassName="flex items-center gap-[24px]"
          className="mt-0"
          label="Tổng TC tích lũy"
          value={totalCredits ?? 0}
          disabled
        />
        <InputField
          containerClassName="flex items-center gap-[24px]"
          className="mt-0"
          label="Điểm TB tích lũy"
          value={totalAvgScore ?? 0}
          disabled
        />

        <Table
          headers={completeCourseTableHeaders}
          data={completeCourseList}
          customProps={{ onOpenNftCompleteCourseModal }}
        />
      </Box>

      <NftClassRegistrationDetailModal
        isOpen={isNFTModalOpen}
        onClose={onCloseNftModal}
        nftClassRegistration={nftClassRegistrationDetail}
      />

      <NftCompleteCourseDetailModal
        isOpen={isNftCompleteCourseModal}
        onClose={onCloseNftCompleteCourseModal}
        nftCompleteCourse={nftCompleteCourseDetail}
      />
    </>
  );
};
