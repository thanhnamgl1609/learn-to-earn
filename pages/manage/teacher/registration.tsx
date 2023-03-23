import { useRouter } from 'next/router';
import { useRegistrationList } from '@hooks/web3';
import CONST from '@config/constants.json';
import { BaseLayout } from '@templates';
import { Table } from '@organisms';
import { useMemo } from 'react';

const { ROLES } = CONST;

const TeacherRegistration = () => {
  const {
    registrationList: { data: applications },
  } = useRegistrationList({ role: ROLES.TEACHER });
  const router = useRouter();
  const tableHeaders = [
    {
      field: 'applicant',
      name: 'Applicant wallet address',
    },
    {
      field: 'meta.fullName',
      name: 'Full name',
    },
  ];
  const onRowClick = (idx: number) => {
    // setDetail();
    // router.push(idx)
  };
  const tableItems = useMemo(
    () => applications?.map((application, id) => ({ id, ...application })) || [],
    [applications]
  );

  return (
    <BaseLayout>
      <Table data={tableItems} headers={tableHeaders} onRowClick={onRowClick} />
      {/* <DetailPage detail={} /> */}
    </BaseLayout>
  );
};

export default TeacherRegistration;
