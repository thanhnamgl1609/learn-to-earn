import { useState } from 'react';
import Link from 'next/link';

import { CourseEntity } from '@_types/models/entities';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { Box, SelectField } from '@molecules';
import { Breadcrumb, Table } from '@organisms';
import { BaseLayout } from '@templates';
import { useCourseListApi } from '@hooks/api';
import { useInputTextChange } from '@hooks/form';

type ActionColumnsProps = {
  item: CourseEntity;
};

const { KNOWLEDGE_BLOCKS } = CONST;

const KNOWLEDGE_BLOCK_BY_IDS = Object.values(KNOWLEDGE_BLOCKS).reduce(
  (prev, current) => ({ ...prev, [current.id]: current }),
  {}
);

const knowledgeBlockOptions = [
  {
    label: 'Tất cả',
    value: 0,
  },
  ...Object.values(KNOWLEDGE_BLOCKS).map(({ id, name }) => ({
    label: name,
    value: id,
  })),
];

const ActionColumns = ({ item }: ActionColumnsProps) => (
  <div>
    <Link
      href={Routes.courseDetail.name.replace(':id', item.id.toString())}
      className="block min-w-[70px] text-center bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80"
    >
      Chi tiết
    </Link>
  </div>
);

const tableHeaders = [
  {
    field: 'id',
    name: 'ID môn học',
  },
  {
    field: 'courseCode',
    name: 'Mã môn học',
    custom: ({ item }: ActionColumnsProps) => (
      <Link href={item.chainURI ?? ''}>{item.courseCode}</Link>
    ),
  },
  {
    field: 'name',
    name: 'Tên môn học',
  },
  {
    field: 'knowledgeBlockId',
    name: 'Knowledge block',
    custom: ({ item }: ActionColumnsProps) => (
      <p>{KNOWLEDGE_BLOCK_BY_IDS[item.knowledgeBlockId].name}</p>
    ),
  },
  {
    field: 'prevCourseId',
    name: 'Môn học tiên quyết',
    custom: ({ item }: ActionColumnsProps) => (
      <p>{item.prevCourse?.name ?? 'Không có'}</p>
    ),
  },
  {
    field: 'credits',
    name: 'Tín chỉ',
  },
  {
    name: 'Action',
    custom: ActionColumns,
  },
];

const CourseList = () => {
  const [query, setQuery] = useState({});
  const { data } = useCourseListApi(query);
  const onSelectChange = useInputTextChange(setQuery);

  const tableItems = data || [];

  const breadcrumbs = [
    {
      label: 'Manager',
      route: Routes.manage,
    },
    {
      label: 'Danh sách môn học',
    },
  ];

  return (
    <BaseLayout>
      <Breadcrumb links={breadcrumbs} />
      <Box autoLayout>
        <SelectField
          containerClassName="inline-block"
          label="Khối kiến thức"
          options={knowledgeBlockOptions}
          name="knowledgeBlockId"
          onChange={onSelectChange}
        />
        <Table
          title="Danh sách môn học"
          data={tableItems}
          headers={tableHeaders}
        />
      </Box>
    </BaseLayout>
  );
};

export default CourseList;
