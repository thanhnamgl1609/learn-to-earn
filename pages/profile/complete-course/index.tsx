import { knowledgeBlockEntity, nftCompleteCourseEntity } from 'domain/models';
import ROUTES from 'config/routes.json';
import CONST from 'config/constants.json';
import { KnowledgeBlockEntityWithGain } from '@_types/api/certificates';
import { ClassEntity } from '@_types/models/entities';
import { useNftCompleteCourseListGroupApi } from '@hooks/api/classes';
import { useAppSelector } from '@hooks/stores';
import { selectCurrentNftIdentity } from '@store/userSlice';
import { BaseLayout } from '@templates';
import { Breadcrumb, Table } from '@organisms';
import { Box } from '@molecules';
import { Button, Heading } from '@atoms';
import { formatDate } from 'utils';
import { useModalController } from '@hooks/ui';
import { NftCompleteCourseDetailModal } from '@templates/Modal';
import { useState } from 'react';

type CompleteCourseColumnProps = {
  item: ClassEntity;
  knowledgeBlock: KnowledgeBlockEntityWithGain;
  onOpenNftCompleteCourseModal: (nft: ClassEntity) => void;
};

const { DATE_TIME } = CONST;

const completeCourseTableHeaders = [
  {
    field: 'nftCompleteCourses[0].tokenId',
    name: 'Token Id',
  },
  {
    field: 'onChainId',
    name: 'Mã lớp học',
  },
  {
    field: 'course.name',
    name: 'Tên môn học',
  },
  {
    name: 'Khối kiến thức',
    custom: ({ knowledgeBlock }: CompleteCourseColumnProps) => (
      <p>{knowledgeBlock.name}</p>
    ),
  },
  {
    field: 'credits',
    name: 'Số tín chỉ',
  },
  {
    name: 'Ngày cấp',
    custom: ({ item }: CompleteCourseColumnProps) => (
      <p>
        {formatDate(item.nftCompleteCourses[0].grantDate, DATE_TIME.DATETIME)}
      </p>
    ),
  },
  {
    field: 'nftCompleteCourses[0].avgScore',
    name: 'Điểm trung bình',
  },
  {
    field: 'teacher.fullName',
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

const CompleteCourseList = () => {
  const { tokenId } = useAppSelector(selectCurrentNftIdentity);
  const {
    data: knowledgeBlocks = knowledgeBlockEntity.createDefaultKnowledgeBlockList(),
  } = useNftCompleteCourseListGroupApi({
    studentTokenId: tokenId,
  });
  const [
    isNftCompleteCourseModal,
    openNftCompleteCourseModal,
    closeNftCompleteCourseModal,
  ] = useModalController();

  const [classInfo, setClassInfo] = useState<ClassEntity | null>(null);
  const onOpenNftCompleteCourseModal = (classInfo: ClassEntity) => {
    openNftCompleteCourseModal();
    setClassInfo(classInfo);
  };

  const onCloseNftCompleteCourseModal = () => {
    closeNftCompleteCourseModal();
    setClassInfo(null);
  };

  const breadcrumbs = [
    {
      route: ROUTES.profile,
      label: 'Profile',
    },
    {
      label: 'Kết quả học tập',
    },
  ];

  return (
    <BaseLayout>
      <Breadcrumb links={breadcrumbs} />

      {knowledgeBlocks.list.map((knowledgeBlock) => (
        <Box autoLayout>
          <Heading>
            {knowledgeBlock.name}
            <span className="ml-1 text-indigo-900">
              ({knowledgeBlock.totalCredits}/{knowledgeBlock.credits})
            </span>
          </Heading>

          <Table
            data={knowledgeBlock.classes}
            headers={completeCourseTableHeaders}
            customProps={{ onOpenNftCompleteCourseModal, knowledgeBlock }}
          />
        </Box>
      ))}

      <NftCompleteCourseDetailModal
        isOpen={isNftCompleteCourseModal}
        onClose={onCloseNftCompleteCourseModal}
        classInfo={classInfo}
      />
    </BaseLayout>
  );
};

export default CompleteCourseList;
