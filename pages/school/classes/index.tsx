import _ from 'lodash';

import { ClassEntity } from '@_types/models/entities';
import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { useRegisterClass } from '@hooks/common';
import { Box } from '@molecules';
import { Breadcrumb, Table } from '@organisms';
import { BaseLayout } from '@templates';
import { Button, Link } from '@atoms';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { openConfirmModal } from '@store/appSlice';
import { useRegisterClassesApi } from '@hooks/api/classes';
import { classEntity } from 'domain/models';
import { useEffect } from 'react';
import { selectCurrentNftClassRegistrations } from '@store/userSlice';

type ColumnProps = {
  item: ClassEntity & { isRegister: boolean };
};

const { KNOWLEDGE_BLOCKS } = CONST;

const KNOWLEDGE_BLOCK_BY_IDS = _.keyBy(KNOWLEDGE_BLOCKS, 'id');
const breadcrumbs = [
  {
    label: 'Home',
    route: ROUTES.school,
  },
  {
    label: 'Danh sách học phần có thể đăng ký',
  },
];
const ActionColumns = ({ item }: ColumnProps) => {
  const dispatch = useAppDispatch();
  const registerClass = useRegisterClass();

  const onRegisterClick = () => {
    dispatch(
      openConfirmModal({
        content: `Đăng ký khóa học ${item.course.name}?`,
        onAccept: () => registerClass(item),
      })
    );
  };

  return (
    <div className="space-y-1">
      <Link
        href={ROUTES.schoolClassDetail.name.replace(
          ':id',
          item.onChainId.toString()
        )}
        className="min-w-[100px]"
        theme="sub"
        size="S"
      >
        Chi tiết
      </Link>

      <Button
        onClick={onRegisterClick}
        className="min-w-[100px]"
        theme="main"
        size="S"
        disabled={item.isRegister}
        disabledTag="Đã đăng ký môn học"
        customTagClassName="p-1 min-w-[160px]"
      >
        Đăng ký
      </Button>
    </div>
  );
};
const tableHeaders = [
  {
    field: 'onChainId',
    name: 'Mã lớp học',
  },
  {
    field: 'course.name',
    name: 'Tên môn học',
  },
  {
    field: 'knowledgeBlockId',
    name: 'Khối kiến thức',
    custom: ({ item }: ColumnProps) => (
      <p>{KNOWLEDGE_BLOCK_BY_IDS[item.knowledgeBlockId].name}</p>
    ),
  },
  {
    field: 'credits',
    name: 'Số tín chỉ',
    custom: ({ item }: ColumnProps) => <p>{item.credits}</p>,
  },
  {
    name: 'Môn học tiên quyết',
    custom: ({ item }: ColumnProps) => (
      <p>{item.course?.prevCourse?.name ?? 'Không có'}</p>
    ),
  },
  {
    field: 'maxSize',
    name: 'Số sinh viên tối đa',
  },
  {
    name: 'Phí đăng ký',
    custom: ({ item }: ColumnProps) => (
      <p>{classEntity.displayRegisterFee(item.registerClassFee)}</p>
    ),
  },
  {
    field: 'numberOfStudents',
    name: 'Số sinh viên đã đăng ký',
  },
  {
    field: 'teacher.fullName',
    name: 'Giảng viên',
  },
  {
    name: 'Action',
    custom: ActionColumns,
  },
];

const RegisteredClassList = () => {
  const { data: registeredClasses } = useRegisterClassesApi();

  return (
    <BaseLayout>
      <Breadcrumb links={breadcrumbs} />
      <Box autoLayout>
        <Table
          title="Danh sách học phần"
          data={registeredClasses || []}
          headers={tableHeaders}
          autoOrderId
        />
      </Box>
    </BaseLayout>
  );
};

export default RegisteredClassList;
