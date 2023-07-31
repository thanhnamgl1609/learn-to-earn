import Link from 'next/link';
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/router';

import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { BaseLayout } from '@templates';
import { Table, Breadcrumb } from '@organisms';
import { Box, InputField, SelectField } from '@molecules';
import { formatDate } from 'utils';
import { useUserListApi } from '@hooks/api';
import { UserEntity } from '@_types/models/entities';

type ActionColumnsProps = {
  item: UserEntity;
};

type RouteQuery = {
  r?: string;
};

const { ROLES, ROLE_LABELS_VI: ROLE_LABELS } = CONST;

const ActionColumns = ({ item }: ActionColumnsProps) => (
  <div className="flex items-center justify-center">
    <Link
      href={`${Routes.memberDetail.name.replace(
        /:id/,
        item.tokenId?.toString()
      )}`}
      className="bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80"
    >
      Chi tiết
    </Link>
  </div>
);

const MemberList = () => {
  const router = useRouter();
  const { r }: RouteQuery = router.query;
  const [currentRole, setCurrentRole] = useState(
    r ? parseInt(r) : ROLES.TEACHER
  );
  const [nameKeyword, setNameKeyword] = useState('');
  const listRoles = [
    {
      label: ROLE_LABELS[ROLES.TEACHER],
      value: ROLES.TEACHER,
    },
    {
      label: ROLE_LABELS[ROLES.STUDENT],
      value: ROLES.STUDENT,
    },
  ];

  const { data: members = [] } = useUserListApi({
    role: currentRole,
  });

  const displayMembers = useMemo(() => {
    if (!nameKeyword || nameKeyword.length < 3) return members;

    return members.filter(({ fullName }) =>
      fullName.toLowerCase().includes(nameKeyword.toLowerCase())
    );
  }, [nameKeyword, members]);

  const onChangeNameKeyword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setNameKeyword(e.target.value),
    []
  );

  const tableHeaders = useMemo(
    () => [
      {
        field: 'tokenId',
        name: 'Token ID',
        textCenter: true,
      },
      {
        field: 'memberCode',
        name:
          currentRole === ROLES.TEACHER
            ? 'Mã nhân viên'
            : 'Mã sinh viên',
        textCenter: true,
      },
      {
        field: 'fullName',
        name: 'Họ và tên',
        textCenter: true,
      },
      {
        field: 'phone',
        name: 'SĐT',
        textCenter: true,
        hideOnTablet: true,
      },
      {
        name: 'Ngày hết hạn',
        custom: ({ item }: ActionColumnsProps) => (
          <p
            className={`text-center ${
              item.isExpired ? 'font-bold text-red-600' : ''
            }`}
          >
            {formatDate(item.expiredAt)}
          </p>
        ),
        hideOnTablet: true,
      },
      {
        name: 'Action',
        custom: ActionColumns,
      },
    ],
    [currentRole]
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
          title={`Danh sách ${ROLE_LABELS[currentRole]}`}
          subheader={
            <div className="flex gap-[16px]">
              <InputField
                containerClassName="flex-1"
                label="Họ tên"
                value={nameKeyword}
                onChange={onChangeNameKeyword}
                placeholder="Nhập họ tên để tìm kiếm (ít nhất 3 ký tự)..."
              />
              <SelectField
                containerClassName="flex-1"
                label={'Vai trò'}
                options={listRoles}
                value={currentRole}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setCurrentRole(parseInt(e.target.value))
                }
              />
            </div>
          }
          data={displayMembers}
          headers={tableHeaders}
          fullWidth
          autoOrderId
        />
      </Box>
    </BaseLayout>
  );
};

export default MemberList;
