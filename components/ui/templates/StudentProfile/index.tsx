import _ from 'lodash';

import { NftClassRegistrationEntity } from '@_types/models/entities';
import CONST from '@config/constants.json';
import { Box } from '@molecules';
import { Table } from '@organisms';
import { Button, Heading } from '@atoms';
import { formatDate } from 'utils';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { openConfirmModal } from '@store/appSlice';
import { useNftRegistrationClassListApi } from '@hooks/api/classes';
import { NftClassRegistrationDetailModal } from '@templates/Modal';
import { useModalController } from '@hooks/ui';
import { useState } from 'react';
import { selectCurrentNftIdentity } from '@store/userSlice';

type ClassColumnProps = {
  item: NftClassRegistrationEntity;
  onOpenNftModal: (nft: NftClassRegistrationEntity) => void;
};

const { KNOWLEDGE_BLOCKS, DATE_TIME } = CONST;
const KNOWLEDGE_BLOCK_BY_IDS = _.keyBy(KNOWLEDGE_BLOCKS, 'id');

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
    field: 'class.knowledgeBlockId',
    name: 'Khối kiến thức',
    custom: ({ item }: ClassColumnProps) => (
      <p>{KNOWLEDGE_BLOCK_BY_IDS[item.class.knowledgeBlockId].name}</p>
    ),
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
            onAccept: () => {},
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
            className="bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80 w-[120px]"
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
  const { data: registeredClasses = [] } = useNftRegistrationClassListApi({
    tokenId,
  });
  const [isNFTModalOpen, openNftModal, closeNFTModal] = useModalController();
  const [nftClassRegistrationDetail, setNftClassRegistrationDetail] =
    useState<NftClassRegistrationEntity | null>(null);
  const onOpenNftModal = (nftClassRegistration: NftClassRegistrationEntity) => {
    openNftModal();
    setNftClassRegistrationDetail(nftClassRegistration);
  };
  const onCloseNftModal = () => {
    closeNFTModal();
    setNftClassRegistrationDetail(null);
  };

  return (
    <Box className="px-8 py-6" autoLayout>
      <Heading>Môn học đã đăng ký</Heading>
      <Table
        headers={classTableHeaders}
        data={registeredClasses}
        customProps={{ onOpenNftModal }}
      />

      <NftClassRegistrationDetailModal
        isOpen={isNFTModalOpen}
        onClose={onCloseNftModal}
        nftClassRegistration={nftClassRegistrationDetail}
      />
    </Box>
  );
};
