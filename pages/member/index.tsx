import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import { NftIdentity } from '@_types/nftIdentity';
import { useMemberList } from '@hooks/web3';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { BaseLayout } from '@templates';
import { Table, Breadcrumb } from '@organisms';
import { Box } from '@molecules';
import { formatDate } from 'utils';
import { useUserListApi } from '@hooks/api';
import { UserEntity } from '@_types/models/entities';

type ActionColumnsProps = {
  item: UserEntity;
};

type RouteQuery = {
  r?: string;
};

const { ROLES, ROLE_LABELS_VI } = CONST;

const AVAILABLE_ROLES = [ROLES.STUDENT, ROLES.TEACHER];

const ActionColumns = ({ item }: ActionColumnsProps) => (
  <div>
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
  const currentRole = parseInt(r);

  const { data: members = [] } = useUserListApi({ role: currentRole });

  const tableHeaders = useMemo(
    () => [
      {
        field: 'tokenId',
        name: 'Token ID',
      },
      {
        field: 'memberCode',
        name: currentRole === ROLES.TEACHER ? 'Mã nhân viên' : 'Mã sinh viên',
      },
      {
        field: 'fullName',
        name: 'Họ và tên',
      },
      {
        name: 'Ngày hết hạn',
        custom: ({ item }: ActionColumnsProps) => (
          <p className={item.isExpired ? 'font-bold text-red-600' : ''}>
            {formatDate(item.expiredAt)}
          </p>
        ),
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
      label: 'Trang chủ',
      route: Routes.manage,
    },
    {
      label: `Danh sách ${ROLE_LABELS_VI[currentRole]}`,
    },
  ];

  useEffect(() => {
    if (AVAILABLE_ROLES.every((role) => role !== currentRole)) {
      router.push(Routes.manage.name);
    }
  }, []);

  return (
    <BaseLayout>
      <Breadcrumb links={breadcrumbs} />
      <Box autoLayout>
        <Table
          title={`Danh sách ${ROLE_LABELS_VI[currentRole]}`}
          data={members}
          headers={tableHeaders}
          autoOrderId
        />
      </Box>
    </BaseLayout>
  );
};

export default MemberList;
