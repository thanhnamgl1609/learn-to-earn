import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { RegistrationInfo } from '@_types/nftIdentity';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { selectRegistrationByAddr } from '@store/manageSlice';
import { useFormSubmit, useInputTextChange } from '@hooks/form';
import { useModalController } from '@hooks/ui';
import { withAuth } from '@hooks/routes';
import { Image } from '@atoms';
import { GroupTwoButtons, InputField } from '@molecules';
import { Breadcrumb, RegistrationDetail, Form } from '@organisms';
import { BaseLayout, Modal } from '@templates';
import { useGrantNftIdentity, useRejectNftIdentity } from '@hooks/common';

type Query = {
  address: string;
};

type NftIdentityInfo = {
  expiredAt: string;
};

const { ROLE_LABELS, ROLES } = CONST;
const DEFAULT_EXPIRED_AFTER_MONTHS = {
  [ROLES.STUDENT]: 4,
  [ROLES.TEACHER]: 1,
};

const createFormStateDefault = (): RegistrationInfo & NftIdentityInfo => ({
  applicant: '',
  documentURI: '',
  expiredAt: moment().format('YYYY-MM-DD'),
  meta: {
    documentURIs: [],
    fullName: '',
    profileImage: '',
  },
  role: 0,
});

const RegistrationInfoDetail = () => {
  const router = useRouter();

  const registrationsByAddr = useSelector(selectRegistrationByAddr);
  const { address } = router.query as Query;
  const application = registrationsByAddr[address];
  const managementURL = `${Routes.manageRegistration.name}?r=${application?.role}`;
  const breadcrumbs = [
    {
      label: 'Manager',
      route: Routes.manage,
    },
    {
      label: `${ROLE_LABELS[application.role]} registration manager`,
      route: { name: managementURL },
    },
    {
      label: address,
    },
  ];

  const [formState, setFormState] = useState(createFormStateDefault());
  const onInputChange = useInputTextChange(setFormState);
  const grantNftIdentity = useGrantNftIdentity(formState);
  const rejectNftIdentity = useRejectNftIdentity(formState);

  const [isApprovalModalOpen, onOpenApprovalModal, onCloseApprovalModal] =
    useModalController();

  const onGrant = useFormSubmit(grantNftIdentity, [grantNftIdentity]);

  useEffect(() => {
    if (!application) router.push(managementURL);
    else
      setFormState((_formState) => ({
        ..._formState,
        ...application,
        expiredAt: moment()
          .add(DEFAULT_EXPIRED_AFTER_MONTHS[application.role], 'M')
          .format('YYYY-MM-DD'),
      }));
  }, []);

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
      </BaseLayout>

      <Modal
        className="w-[800px] overflow-auto"
        isOpen={isApprovalModalOpen}
        onClose={onCloseApprovalModal}
      >
        <Form className="w-[100%]" submitText="Grant" onSubmit={onGrant}>
          <InputField label="Metadata" value={formState.documentURI} readOnly />
          <InputField
            label="Full Name"
            value={formState.meta.fullName}
            readOnly
          />
          <div className="grid grid-cols-2 gap-2">
            {formState.meta.documentURIs.map((uri) => (
              <Image src={uri} alt="" key={uri} canZoomIn />
            ))}
          </div>
          <InputField
            label="Expired Date"
            name="expiredAt"
            type="date"
            value={formState.expiredAt}
            onChange={onInputChange}
          />
        </Form>
      </Modal>
    </>
  );
};

export default RegistrationInfoDetail;
