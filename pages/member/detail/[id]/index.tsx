import { useRouter } from 'next/router';

import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import {
  Breadcrumb,
  MemberStudentProfile,
  MemberTeacherProfile,
} from '@organisms';
import { BaseLayout } from '@templates';
import MemberDetail from 'components/ui/organisms/MemberDetail';
import { useMemberDetail } from '@hooks/api';

type Query = {
  id: string;
};

const { ROLES, ROLE_LABELS_VI } = CONST;

const MemberDetailPage = () => {
  const router = useRouter();

  const { id: _tokenId } = router.query as Query;
  const tokenId = parseInt(_tokenId);
  const { data: member } = useMemberDetail({ tokenId });
  const memberListUrl = `${Routes.member.name}?r=${member?.role}`;
  const breadcrumbs = [
    {
      label: 'Dashboard',
      route: Routes.manage,
    },
    {
      label: `Danh sách ${(
        ROLE_LABELS_VI[member?.role] ?? ''
      ).toLowerCase()}`,
      route: { name: memberListUrl },
    },
    {
      label: _tokenId,
    },
  ];

  return (
    <>
      <BaseLayout>
        <Breadcrumb links={breadcrumbs} />

        {member && <MemberDetail user={member} />}
        {member?.role === ROLES.TEACHER && (
          <MemberTeacherProfile user={member} />
        )}
        {member?.role === ROLES.STUDENT && (
          <MemberStudentProfile user={member} />
        )}
      </BaseLayout>
    </>
  );
};

export default MemberDetailPage;
