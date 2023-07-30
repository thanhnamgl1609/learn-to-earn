import ROUTES from 'config/routes.json';
import { Heading, LinkBox } from '@atoms';
import CONST from 'config/constants.json';
import { Breadcrumb, Table } from '@organisms';
import { RequestGraduationEntity } from '@_types/models/entities';
import { BaseLayout } from '@templates';
import { Box, InputField } from '@molecules';
import { useRequestGraduationList } from '@hooks/api';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';

type ColumnProps = {
  item: RequestGraduationEntity;
};

const { REQUEST_STATUS } = CONST;

const requestGraduationHeader = [
  {
    field: 'student.tokenId',
    name: 'Token ID',
  },
  {
    field: 'student.memberCode',
    name: 'MSSV',
  },
  {
    field: 'student.fullName',
    name: 'Tên sinh viên',
  },
  {
    name: 'Hành động',
    custom: ({ item }: ColumnProps) => (
      <LinkBox
        theme="main"
        href={ROUTES.requestGraduationDetail.name.replace(
          /:id/,
          item.studentTokenId.toString()
        )}
      >
        Xem chi tiết
      </LinkBox>
    ),
  },
];

const RequestGraduationList = () => {
  const { data: requestGraduations = [] } = useRequestGraduationList({
    status: REQUEST_STATUS.PENDING,
  });
  const [nameKeyword, setNameKeyword] = useState('');

  const displayItems = useMemo(() => {
    if (!nameKeyword || nameKeyword.length < 3)
      return requestGraduations;

    return requestGraduations.filter(({ student: { fullName } }) =>
      fullName.toLowerCase().includes(nameKeyword.toLowerCase())
    );
  }, [nameKeyword, requestGraduations]);

  const onChangeNameKeyword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setNameKeyword(e.target.value),
    []
  );

  const links = [
    {
      label: 'Trang chủ',
      route: ROUTES.home,
    },
    {
      label: 'Danh sách đơn yêu cầu tốt nghiệp',
    },
  ];

  return (
    <BaseLayout>
      <Breadcrumb links={links} />

      <Box autoLayout>
        <Table
          subheader={
            <div className="flex flex-wrap gap-[16px]">
              <InputField
                containerClassName="w-[50%]"
                label="Tên sinh viên"
                value={nameKeyword}
                onChange={onChangeNameKeyword}
                placeholder="Nhập tên sinh viên để tìm kiếm (ít nhất 3 ký tự)..."
              />
            </div>
          }
          title="Danh sách sinh viên yêu cầu tốt nghiệp"
          headers={requestGraduationHeader}
          data={displayItems}
          autoOrderId
        />
      </Box>
    </BaseLayout>
  );
};

export default RequestGraduationList;
