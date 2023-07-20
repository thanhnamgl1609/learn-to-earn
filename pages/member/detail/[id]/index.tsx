import { useRouter } from 'next/router';

import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { Breadcrumb } from '@organisms';
import { BaseLayout } from '@templates';
import MemberDetail from 'components/ui/organisms/MemberDetail';
import { useMemberDetail } from '@hooks/api';

type Query = {
  id: string;
};

const { ROLE_LABELS, ROLE_LABELS_VI } = CONST;

const MemberDetailPage = () => {
  const router = useRouter();

  const { id: _tokenId } = router.query as Query;
  const tokenId = parseInt(_tokenId);
  const { data: member } = useMemberDetail({ tokenId });
  const breadcrumbs = [
    {
      label: 'Manager',
      route: Routes.manage,
    },
    {
      label: `Danh sách ${ROLE_LABELS_VI[member?.role] ?? ''}`,
    },
  ];

  return (
    <>
      <BaseLayout>
        <Breadcrumb links={breadcrumbs} />

        {member && <MemberDetail user={member} />}
      </BaseLayout>
    </>
  );
};

export default MemberDetailPage;
