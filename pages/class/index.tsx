import { useMemo, useState } from 'react';
import Link from 'next/link';

import { Class } from '@_types/school';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { useClassListApi } from '@hooks/api/classes';
import { ClassEntity } from '@_types/models/entities';
import { useSemesterListApi } from '@hooks/api';
import { Box, SelectField } from '@molecules';
import { Breadcrumb, Table } from '@organisms';
import { BaseLayout } from '@templates';
import { useInputTextChange, useSelectOptions } from '@hooks/form';
import {  semesterEntity } from 'domain/models';

type ActionColumnsProps = {
  item: ClassEntity;
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
    field: 'onChainId',
    name: 'Mã lớp học',
  },
  {
    name: 'Tên môn học',
    custom: ({ item }: ActionColumnsProps) => (
      <Link
        className="underline hover:opacity-80"
        href={item.chainURI}
        target="_blank"
      >
        {item.course.name}
      </Link>
    ),
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
    custom: ({ item }: ActionColumnsProps) => <p>{item.credits}</p>,
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
    field: 'teacher.fullName',
    name: 'Giảng viên',
  },
  {
    name: 'Action',
    custom: ActionColumns,
  },
];

const ClassList = () => {
  const [query, setQuery] = useState({
    semesterId: 0,
  });
  const onSelectChange = useInputTextChange(setQuery);
  const { data: classList } = useClassListApi(query);
  const { data: semesters } = useSemesterListApi();
  const semesterOptions = useSelectOptions(semesters, {
    labelField: 'id',
    noSelectLabel: 'Tất cả học kì',
    customLabel: (item) => semesterEntity.displaySemester(item),
  });

  const tableItems = classList || [];

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
        <div className="flex">
          <SelectField
            label="Khối kiến thức"
            options={semesterOptions}
            name="semesterId"
            onChange={onSelectChange}
          />
        </div>

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
