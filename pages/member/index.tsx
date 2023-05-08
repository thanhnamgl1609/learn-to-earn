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

type ActionColumnsProps = {
  item: Omit<NftIdentity, 'tokenId'> & { id: number };
};

type RouteQuery = {
  r?: string;
};

const { ROLES, ROLE_LABELS_VI } = CONST;

const AVAILABLE_ROLES = [ROLES.STUDENT, ROLES.TEACHER];

const ActionColumns = ({ item }: ActionColumnsProps) => (
  <div>
    <Link
      href={`${Routes.memberDetail.name}/${item.id}`}
      className="bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80"
    >
      View
    </Link>
  </div>
);

const tableHeaders = [
  {
    field: 'id',
    name: 'Token ID',
  },
  {
    field: 'meta.fullName',
    name: 'Họ và tên',
  },
  {
    field: 'meta.expiredAt',
    name: 'Ngày hết hạn',
    custom: ({ item }: ActionColumnsProps) => (
      <p className={item.isExpired && 'font-bold text-red-600'}>{formatDate(item.expiredAt)}</p>
    ),
  },
  // {
  //   name: 'Action',
  //   custom: ActionColumns,
  // },
];

const MemberList = () => {
  const router = useRouter();
  const { r }: RouteQuery = router.query;
  const currentRole = parseInt(r);

  const {
    memberList: { data: members },
  } = useMemberList({ role: currentRole });

  const displayMembers =
    members?.map(({ tokenId, ...otherInfo }) => ({
      id: tokenId,
      ...otherInfo,
    })) || [];

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
          data={displayMembers}
          headers={tableHeaders}
          autoOrderId
        />
      </Box>
    </BaseLayout>
  );
};

export default MemberList;
