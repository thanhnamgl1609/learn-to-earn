import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';

import Routes from '@config/routes.json';
import { useClassListApi } from '@hooks/api/classes';
import { ClassEntity } from '@_types/models/entities';
import { useSemesterListApi } from '@hooks/api';
import { Box, InputField, SelectField } from '@molecules';
import { Breadcrumb, Table } from '@organisms';
import { BaseLayout } from '@templates';
import { useInputTextChange, useSelectOptions } from '@hooks/form';
import { semesterEntity } from 'domain/models';

type ActionColumnsProps = {
  item: ClassEntity;
};

const ActionColumns = ({ item }: ActionColumnsProps) => (
  <div className="flex items-center justify-center">
    <Link
      href={Routes.classDetail.name.replace(
        ':id',
        item.onChainId.toString()
      )}
      className="min-w-[64px] bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80"
    >
      Chi tiết
    </Link>
  </div>
);

const tableHeaders = [
  {
    field: 'onChainId',
    name: 'Mã lớp học',
    textCenter: true,
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
    field: 'knowledgeBlock.name',
    name: 'Khối kiến thức',
    textCenter: true,
  },
  {
    field: 'credits',
    name: 'Số tín chỉ',
    custom: ({ item }: ActionColumnsProps) => <p>{item.credits}</p>,
  },
  {
    field: 'maxSize',
    name: 'Số SV tối đa',
    textCenter: true,
  },
  {
    field: 'numberOfStudents',
    name: 'Số SV đăng ký',
    textCenter: true,
  },
  {
    name: 'Phí đăng ký',
    custom: ({ item: { registerClassFee } }: ActionColumnsProps) => (
      <p>{registerClassFee} ETH</p>
    ),
  },
  {
    field: 'teacher.fullName',
    name: 'Giảng viên',
    textCenter: true,
  },
  {
    name: 'Action',
    custom: ActionColumns,
  },
];

const ClassList = () => {
  const [query, setQuery] = useState({
    semesterId: '0',
  });
  const onSelectChange = useInputTextChange(setQuery);
  const { data: classList } = useClassListApi(query);
  const { data: semesters } = useSemesterListApi();
  const [nameKeyword, setNameKeyword] = useState('');
  const semesterOptions = useSelectOptions(semesters, {
    labelField: 'id',
    noSelectLabel: 'Tất cả học kì',
    customLabel: (item) => semesterEntity.displaySemester(item),
  });

  const tableItems = classList || [];

  const displayItems = useMemo(() => {
    if (!nameKeyword || nameKeyword.length < 3) return tableItems;

    return tableItems.filter(({ course: { name } }) =>
      name.toLowerCase().includes(nameKeyword.toLowerCase())
    );
  }, [nameKeyword, tableItems]);

  const onChangeNameKeyword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setNameKeyword(e.target.value),
    []
  );

  const breadcrumbs = [
    {
      label: 'Dashboard',
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
          subheader={
            <div className="flex flex-wrap gap-[16px]">
              <InputField
                containerClassName="flex-1"
                label="Tên môn học"
                value={nameKeyword}
                onChange={onChangeNameKeyword}
                placeholder="Nhập tên môn học để tìm kiếm (ít nhất 3 ký tự)..."
              />
              <SelectField
                containerClassName="flex-1"
                label="Học kì"
                options={semesterOptions}
                name="semesterId"
                onChange={onSelectChange}
              />
            </div>
          }
          data={displayItems}
          headers={tableHeaders}
        />
      </Box>
    </BaseLayout>
  );
};

export default ClassList;
