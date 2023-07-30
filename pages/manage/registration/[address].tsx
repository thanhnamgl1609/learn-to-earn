import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { selectRegistrationByAddr } from '@store/manageSlice';
import { useModalController } from '@hooks/ui';
import { GroupTwoButtons } from '@molecules';
import { Breadcrumb, RegistrationDetail } from '@organisms';
import { BaseLayout } from '@templates';
import { useRejectNftIdentity } from '@hooks/common';
import { FormNftIdentityDetail } from '@templates/Modal';

type Query = {
  address: string;
};

const { ROLE_LABELS_VI: ROLE_LABELS } = CONST;

const RegistrationInfoDetail = () => {
  const router = useRouter();

  const { address } = router.query as Query;
  const registrationsByAddr = useSelector(selectRegistrationByAddr);
  const application = registrationsByAddr[address];
  const managementURL = `${Routes.manageRegistration.name}?r=${application?.role}`;
  if (!application) router.push(managementURL);
  const breadcrumbs = [
    {
      label: 'Dashboard',
      route: Routes.manage,
    },
    {
      label: `Danh sách ${ROLE_LABELS[
        application.role
      ].toLowerCase()}`,
      route: { name: managementURL },
    },
    {
      label: address,
    },
  ];

  const [
    isApprovalModalOpen,
    onOpenApprovalModal,
    onCloseApprovalModal,
  ] = useModalController();
  const rejectNftIdentity = useRejectNftIdentity(application);

  return (
    <>
      <BaseLayout>
        <Breadcrumb links={breadcrumbs} />
        {application && (
          <RegistrationDetail registration={application.meta}>
            <GroupTwoButtons
              className="mt-4"
              firstLabel="Approve"
              secondLabel="Reject"
              onClickFirst={onOpenApprovalModal}
              onClickSecond={rejectNftIdentity}
              main={1}
            />
          </RegistrationDetail>
        )}

        <FormNftIdentityDetail
          isOpen={isApprovalModalOpen}
          onClose={onCloseApprovalModal}
          application={application}
        />
      </BaseLayout>
    </>
  );
};

export default RegistrationInfoDetail;
