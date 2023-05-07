import { useMemo } from 'react';
import Link from 'next/link';

import { Course } from '@_types/school';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { useCourseList } from '@hooks/web3';
import { Box } from '@molecules';
import { Breadcrumb, Table } from '@organisms';
import { BaseLayout } from '@templates';

type ActionColumnsProps = {
  item: Course;
};

const { KNOWLEDGE_BLOCKS } = CONST;

const KNOWLEDGE_BLOCK_BY_IDS = Object.values(KNOWLEDGE_BLOCKS).reduce(
  (prev, current) => ({ ...prev, [current.id]: current }),
  {}
);

const ActionColumns = ({ item }: ActionColumnsProps) => (
  <div>
    <Link
      href={Routes.courseDetail.name.replace(':id', item.id.toString())}
      className="bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80"
    >
      View
    </Link>
  </div>
);

const tableHeaders = [
  {
    field: 'id',
    name: 'Course ID',
  },
  {
    field: 'meta.name',
    name: 'Course Name',
  },
  {
    field: 'prevCourseId',
    name: 'Compulsory Course',
    custom: ({ item }: ActionColumnsProps) => (
      <p>{item.prevCourse ? item.prevCourse.meta?.name || 'ERROR' : 'None'}</p>
    ),
  },
  {
    field: 'knowledgeBlockId',
    name: 'Knowledge block',
    custom: ({ item }: ActionColumnsProps) => (
      <p>{KNOWLEDGE_BLOCK_BY_IDS[item.knowledgeBlockId].name}</p>
    ),
  },
  {
    name: 'Action',
    custom: ActionColumns,
  },
];

const CourseList = () => {
  const {
    courseList: { data },
  } = useCourseList();

  const tableItems = useMemo(() => data || [], [data]);

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
        <Table title="Danh sách môn học" data={tableItems} headers={tableHeaders} />
      </Box>
    </BaseLayout>
  );
};

export default CourseList;
