import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import { RegistrationInfo } from '@_types/nftIdentity';
import { useRegistrationList } from '@hooks/web3';
import { withAuth } from '@hooks/routes';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { useAppDispatch } from '@hooks/stores';
import { updateRegistrations } from '@store/manageSlice';
import { BaseLayout } from '@templates';
import { Table, Breadcrumb } from '@organisms';
import { Box } from '@molecules';

type ActionColumnsProps = {
  item: RegistrationInfo & { id: number };
};

type RouteQuery = {
  r?: string;
};

const { ROLES, ROLE_LABELS } = CONST;

const AVAILABLE_ROLES = [ROLES.STUDENT, ROLES.TEACHER];

const ActionColumns = ({ item }: ActionColumnsProps) => (
  <div>
    <Link
      href={`${Routes.manageRegistration.name}/${item.applicant}`}
      className="bg-indigo-900 px-2 py-1 text-white rounded-[4px] hover:opacity-80"
    >
      View
    </Link>
  </div>
);

const tableHeaders = [
  {
    field: 'applicant',
    name: 'Applicant wallet address',
  },
  {
    field: 'meta.fullName',
    name: 'Full name',
  },
  {
    name: 'Action',
    custom: ActionColumns,
  },
];

const RegistrationList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { r }: RouteQuery = router.query;
  const currentRole = parseInt(r);

  const {
    registrationList: { data: applications },
  } = useRegistrationList({ role: currentRole });

  const tableItems = useMemo(
    () =>
      applications?.map((application, id) => ({ id, ...application })) || [],
    [applications]
  );

  const breadcrumbs = [
    {
      label: 'Manager',
      route: Routes.manage,
    },
    {
      label: `${ROLE_LABELS[currentRole]} registration manager`,
    },
  ];

  useEffect(() => {
    if (AVAILABLE_ROLES.every((role) => role !== currentRole)) {
      router.push(Routes.manageRegistration.name);
    }
  }, []);

  useEffect(() => {
    dispatch(updateRegistrations(applications));
  }, [applications]);

  return (
    <BaseLayout>
      <Breadcrumb links={breadcrumbs} />
      <Box autoLayout>
        <Table
          title={`List registered ${ROLE_LABELS[currentRole]}`}
          data={tableItems}
          headers={tableHeaders}
        />
      </Box>
      {/* <DetailPage detail={} /> */}
    </BaseLayout>
  );
};

export default RegistrationList;
