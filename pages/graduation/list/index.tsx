import Link from 'next/link';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';

import Routes from '@config/routes.json';
import { BaseLayout } from '@templates';
import { Table, Breadcrumb } from '@organisms';
import { Box, InputField, SelectField } from '@molecules';
import { formatDate } from 'utils';
import { NftGraduationEntity } from '@_types/models/entities';
import { useNftGraduationList } from '@hooks/api';

type ActionColumnsProps = {
  item: NftGraduationEntity;
};

const ActionColumns = ({ item }: ActionColumnsProps) => (
  <div className="flex items-center justify-center">
    <Link
      href={`${Routes.graduationDetail.name.replace(
        /:id/,
        item.tokenId?.toString()
      )}`}
      className="bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80"
    >
      Chi tiết
    </Link>
  </div>
);

const tableHeaders = [
  {
    field: 'student.tokenId',
    name: 'Token ID',
    textCenter: true,
  },
  {
    field: 'student.memberCode',
    name: 'MSSV',
    textCenter: true,
  },
  {
    field: 'student.fullName',
    name: 'Họ và tên',
    textCenter: true,
  },
  {
    field: 'student.phone',
    name: 'SĐT',
    textCenter: true,
  },
  {
    name: 'Ngày cấp',
    custom: ({ item }: ActionColumnsProps) => (
      <p className={`text-center`}>{formatDate(item.grantDate)}</p>
    ),
  },
  {
    name: 'Action',
    custom: ActionColumns,
  },
];

const NftGraduationList = () => {
  const [nameKeyword, setNameKeyword] = useState('');

  const { data: students = [] } = useNftGraduationList({});
  console.log(
    '🚀 ~ file: index.tsx:88 ~ NftGraduationList ~ students:',
    students
  );

  const displayStudents = useMemo(() => {
    if (!nameKeyword || nameKeyword.length < 3) return students;

    return students.filter(({ student: { fullName } }) =>
      fullName.toLowerCase().includes(nameKeyword.toLowerCase())
    );
  }, [nameKeyword, students]);

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
      label: `Danh sách thành viên`,
    },
  ];

  return (
    <BaseLayout>
      <Breadcrumb links={breadcrumbs} />
      <Box autoLayout>
        <Table
          title={`Danh sách sinh viên đã tốt nghiệp`}
          subheader={
            <div className="flex gap-[16px]">
              <InputField
                containerClassName="flex-1"
                label="Họ tên"
                value={nameKeyword}
                onChange={onChangeNameKeyword}
                placeholder="Nhập họ tên để tìm kiếm (ít nhất 3 ký tự)..."
              />
            </div>
          }
          data={displayStudents}
          headers={tableHeaders}
          fullWidth
          autoOrderId
        />
      </Box>
    </BaseLayout>
  );
};

export default NftGraduationList;
