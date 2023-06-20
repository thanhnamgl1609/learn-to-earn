import { useState } from 'react';
import Link from 'next/link';

import { CourseEntity } from '@_types/models/entities';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { Box, SelectField } from '@molecules';
import { Breadcrumb, Table } from '@organisms';
import { BaseLayout } from '@templates';
import { useCourseListApi } from '@hooks/api';
import { useInputTextChange, useSelectOptions } from '@hooks/form';
import { Button } from '@atoms';
import { useSyncCourse } from '@hooks/common/useSyncCourse';
import { useKnowledgeBlockListApi } from '@hooks/api/knowledge-blocks';

type ActionColumnsProps = {
  item: CourseEntity;
};

const ActionColumns = ({ item }: ActionColumnsProps) => (
  <div>
    <Link
      href={Routes.courseDetail.name.replace(':id', item.id?.toString())}
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
    field: 'knowledgeBlock.name',
    name: 'Khối kiến thức',
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
  const { data, revalidate } = useCourseListApi(query);
  const syncCourse = useSyncCourse(revalidate);
  const onSelectChange = useInputTextChange(setQuery);
  const { data: knowledgeBlocks } = useKnowledgeBlockListApi();
  const knowledgeBlockOptions = useSelectOptions(knowledgeBlocks, {
    noSelectLabel: 'Tất cả khối kiến thức',
    labelField: 'name',
    valueField: 'id',
  });

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
        <div className="flex">
          <SelectField
            label="Khối kiến thức"
            options={knowledgeBlockOptions}
            name="knowledgeBlockId"
            onChange={onSelectChange}
          />

          <Button
            className="ml-auto px-4 h-[31px] mt-auto bg-indigo-900 text-white text-sm"
            size="S"
            onClick={syncCourse}
          >
            Đồng bộ
          </Button>
        </div>
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
