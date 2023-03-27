import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRegistrationList } from '@hooks/web3';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { BaseLayout } from '@templates';
import { Table, Breadcrumb } from '@organisms';
import { useEffect, useMemo } from 'react';
import { RegistrationInfo } from '@_types/nftIdentity';
import { useAppDispatch } from '@hooks/stores';
import { updateRegistrations } from '@store/manageSlice';
import { Box } from '@molecules';

const { ROLES } = CONST;

const TeacherRegistration = () => {
  const {
    registrationList: { data: applications },
  } = useRegistrationList({ role: ROLES.TEACHER });
  const dispatch = useAppDispatch();
  const breadcrumbs = useMemo(
    () => [
      {
        label: 'Manager',
        link: Routes.manage,
      },
      {
        label: 'Teacher registration manager',
      },
    ],
    []
  );
  const ActionColumns = ({
    item,
  }: {
    item: RegistrationInfo & { id: number };
  }) => (
    <div>
      <Link
        href={`${Routes.manageTeacherRegistration}/${item.applicant}`}
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
  const tableItems = useMemo(
    () =>
      applications?.map((application, id) => ({ id, ...application })) || [],
    [applications]
  );
  useEffect(() => {
    dispatch(updateRegistrations(applications));
  }, [applications]);

  return (
    <BaseLayout>
      <Breadcrumb links={breadcrumbs} />
      <Box autoLayout>
        <Table
          title="List registered teacher"
          data={tableItems}
          headers={tableHeaders}
        />
      </Box>
      {/* <DetailPage detail={} /> */}
    </BaseLayout>
  );
};

export default TeacherRegistration;
