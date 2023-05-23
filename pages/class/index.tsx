import { useMemo } from 'react';
import Link from 'next/link';

import { Class } from '@_types/school';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { useClassList } from '@hooks/web3';
import { Box } from '@molecules';
import { Breadcrumb, Table } from '@organisms';
import { BaseLayout } from '@templates';

type ActionColumnsProps = {
  item: Class;
};

const { KNOWLEDGE_BLOCKS } = CONST;

const KNOWLEDGE_BLOCK_BY_IDS = Object.values(KNOWLEDGE_BLOCKS).reduce(
  (prev, current) => ({ ...prev, [current.id]: current }),
  {}
);

const ActionColumns = ({ item }: ActionColumnsProps) => (
  <div>
    <Link
      href={Routes.classDetail.name.replace(':id', item.id.toString())}
      className="bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80"
    >
      View
    </Link>
  </div>
);

const tableHeaders = [
  {
    field: 'id',
    name: 'Mã lớp học',
  },
  {
    field: 'meta.courseName',
    name: 'Tên môn học',
  },
  {
    field: 'knowledgeBlockId',
    name: 'Khối kiến thức',
    custom: ({ item }: ActionColumnsProps) => (
      <p>{KNOWLEDGE_BLOCK_BY_IDS[item.knowledgeBlockId].name}</p>
    ),
  },
  {
    field: 'credits',
    name: 'Số tín chỉ',
    custom: ({ item }: ActionColumnsProps) => (
      <p>{item.credits}</p>
    ),
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
    field: 'meta.teacherName',
    name: 'Giảng viên',
  },
  {
    name: 'Action',
    custom: ActionColumns,
  },
];

const ClassList = () => {
  const {
    classList: { data },
  } = useClassList();

  const tableItems = useMemo(() => data || [], [data]);

  const breadcrumbs = [
    {
      label: 'Manager',
      route: Routes.manage,
    },
    {
      label: 'Danh sách lớp học',
    },
  ];

  return (
    <BaseLayout>
      <Breadcrumb links={breadcrumbs} />
      <Box autoLayout>
        <Table
          title="Danh sách lớp học"
          data={tableItems}
          headers={tableHeaders}
        />
      </Box>
    </BaseLayout>
  );
};

export default ClassList;
