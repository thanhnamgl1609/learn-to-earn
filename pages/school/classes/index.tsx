import _ from 'lodash';

import { Class } from '@_types/school';
import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { useClassList } from '@hooks/web3';
import { useRegisterClass } from '@hooks/common';
import { Box } from '@molecules';
import { Breadcrumb, Table } from '@organisms';
import { BaseLayout } from '@templates';
import { Button } from '@atoms';
import { useAppDispatch } from '@hooks/stores';
import { openConfirmModal } from '@store/appSlice';

type ColumnProps = {
  item: Class;
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
        content: `Đăng ký khóa học ${item.meta.course.name}?`,
        onAccept: () => registerClass(item),
      })
    );
  };

  return (
    <div>
      <Button
        onClick={onRegisterClick}
        className="bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80"
      >
        Đăng ký
      </Button>
    </div>
  );
};
const tableHeaders = [
  {
    field: 'id',
    name: 'Mã lớp học',
  },
  {
    field: 'meta.course.name',
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
    field: 'maxSize',
    name: 'Số sinh viên tối đa',
  },
  {
    field: 'numberOfStudents',
    name: 'Số sinh viên đã đăng ký',
  },
  {
    field: 'meta.teacher.name',
    name: 'Giảng viên',
  },
  {
    name: 'Action',
    custom: ActionColumns,
  },
];

const RegisteredClassList = () => {
  const {
    classList: { data: registeredClasses },
  } = useClassList({ current: true });

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
