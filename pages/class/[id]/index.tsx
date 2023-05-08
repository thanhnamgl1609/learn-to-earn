import { useRouter } from 'next/router';

import CONST from '@config/constants.json';
import ROUTES from '@config/routes.json';
import { useClassDetail } from '@hooks/web3';
import { BaseLayout, ClassDetail } from '@templates';
import { Breadcrumb } from '@organisms';
import { Box } from '@molecules';
import { Heading } from '@atoms';

const ClassDetailPage = () => {
  const router = useRouter();
  const { id: qid } = router.query;
  const id = parseInt(qid as string);
  if (!id || Number.isNaN(id)) return null;

  const {
    classDetail: { data: classDetail },
  } = useClassDetail({ id });

  const links = [
    {
      label: 'Manager',
      route: ROUTES.manage,
    },
    {
      label: 'Class List',
      route: ROUTES.classes,
    },
    {
      label: 'Create Class',
    },
  ];

  return (
    <BaseLayout containerClassName="max-w-[640px]">
      <Breadcrumb links={links} />
      <Box autoLayout>
        <Heading>Class #{classDetail?.id}</Heading>
        {classDetail && <ClassDetail classDetail={classDetail} />}
      </Box>
    </BaseLayout>
  );
};

export default ClassDetailPage;
