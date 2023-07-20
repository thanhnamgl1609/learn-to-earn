import { useRouter } from 'next/router';

import ROUTES from '@config/routes.json';
import { BaseLayout, FormClassDetail } from '@templates';
import { Breadcrumb } from '@organisms';
import { Box } from '@molecules';
import { LinkText } from '@atoms';
import { useClassDetailApi } from '@hooks/api/classes';
import { classEntity } from 'domain/models';

const SchoolClassDetail = () => {
  const router = useRouter();
  const { id: qid } = router.query;
  const id = parseInt(qid as string);
  if (!id || Number.isNaN(id)) return null;

  const { data: classDetail } = useClassDetailApi(id);
  const displayClassDetail = classEntity.displayClassDetail(
    classDetail || classEntity.createLoadingState()
  );

  const links = [
    {
      label: 'Danh sách học phần',
      route: ROUTES.schoolClassList,
    },
    {
      label: `Lớp #${id}`,
    },
  ];

  return (
    <BaseLayout containerClassName="max-w-[640px]">
      <Breadcrumb links={links} />

      <Box autoLayout>
        <LinkText
          href={displayClassDetail?.chainURI ?? ''}
          theme="heading"
          target="_blank"
        >
          Class #{displayClassDetail?.onChainId}
        </LinkText>
        <FormClassDetail formState={displayClassDetail} edit />
      </Box>
    </BaseLayout>
  );
};

export default SchoolClassDetail;
