import { useRouter } from 'next/router';
import CONST from '@config/constants.json';
import Routes from '@config/routes.json';
import { BaseLayout, Modal } from '@templates';
import { Table, Breadcrumb, RegistrationDetail, Form } from '@organisms';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { selectManage } from '@store/manageSlice';
import { Box, GroupTwoButtons, InputField } from '@molecules';
import { RegistrationInfo } from '@_types/nftIdentity';
import { Image } from '@atoms';
import { useManagement } from '@hooks/web3';
import moment from 'moment';

type Query = {
  address: string;
};

type NftIdentityInfo = {
  expiredAt: string;
};

const createFormStateInit = (): RegistrationInfo & NftIdentityInfo => ({
  applicant: '',
  documentURI: '',
  expiredAt: moment().format('YYYY-MM-DD'),
  meta: {
    fullName: '',
    profileImage: '',
    documentURIs: [],
  },
});

const TeacherRegistration = () => {
  const { grantNftIdentity, rejectNftIdentity } = useManagement();
  const router = useRouter();
  const { address } = router.query as Query;
  const [formState, setFormState] = useState(createFormStateInit());
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const breadcrumbs = useMemo(
    () => [
      {
        label: 'Manager',
        link: Routes.manage,
      },
      {
        label: 'Teacher registration manager',
        link: Routes.manageTeacherRegistration,
      },
      {
        label: address,
      },
    ],
    [address]
  );
  const { registrationsByAddr } = useSelector(selectManage);
  const application = useMemo(
    () => registrationsByAddr[address],
    [registrationsByAddr, address]
  );
  const handleFormFieldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFormState({
        ...formState,
        [e.target.name]: e.target.value,
      });
    },
    [formState]
  );
  const onOpenApprovalModal = useCallback(
    () => setIsApprovalModalOpen(true),
    []
  );
  const onCloseApprovalModal = useCallback(
    () => setIsApprovalModalOpen(false),
    []
  );
  const onReject = useCallback(() => {
    const _submitData = {
      address,
      onSuccess: () => router.push(Routes.manageTeacherRegistration),
    };
    rejectNftIdentity(_submitData);
  }, [address]);
  const onGrant = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const _submitData = {
        tokenURI: formState.documentURI,
        address,
        expiredAt: moment(formState.expiredAt).endOf('d').unix(),
        onSuccess: () => router.push(Routes.manageTeacherRegistration),
      };
      grantNftIdentity(_submitData);
    },
    [formState, address]
  );

  useEffect(() => {
    if (!application) router.push(Routes.manageTeacherRegistration);
    else setFormState((_formState) => ({ ..._formState, ...application }));
  }, [application]);

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
              onClickSecond={onReject}
              main={1}
            />
          </RegistrationDetail>
        )}
      </BaseLayout>

      <Modal
        className="w-[800px]"
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
            onChange={handleFormFieldChange}
          />
        </Form>
      </Modal>
    </>
  );
};

export default TeacherRegistration;
