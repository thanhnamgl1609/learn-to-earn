import moment from 'moment';
import { FC, memo, useState } from 'react';

import { type RegistrationInfo } from '@_types/nftIdentity';
import CONST from '@config/constants.json';
import { InputField } from '@molecules';
import { Form } from '@organisms';
import { Modal } from '..';
import { useFormSubmit, useInputTextChange } from '@hooks/form';
import { useGrantNftIdentity } from '@hooks/common';
import { Image } from '@atoms';

type Props = {
  application: RegistrationInfo;
  isOpen: boolean;
  onClose: () => void;
};

type NftIdentityInfo = {
  expiredAt: string;
};

const { ROLES } = CONST;

const DEFAULT_EXPIRED_AFTER_YEARS = {
  [ROLES.STUDENT]: 4,
  [ROLES.TEACHER]: 1,
};

const createFormStateDefault = (
  application: RegistrationInfo
): RegistrationInfo & NftIdentityInfo => ({
  ...application,
  expiredAt: moment()
    .add(DEFAULT_EXPIRED_AFTER_YEARS[application.role], 'year')
    .format('YYYY-MM-DD'),
});

export const FormNftIdentityDetail: FC<Props> = memo(
  ({ application, isOpen, onClose }) => {
    const [formState, setFormState] = useState(
      createFormStateDefault(application)
    );

    const onInputChange = useInputTextChange(setFormState);
    const grantNftIdentity = useGrantNftIdentity();

    const onGrant = useFormSubmit(
      () => grantNftIdentity(formState),
      [grantNftIdentity]
    );

    return (
      <Modal
        className="w-[800px] overflow-auto"
        isOpen={isOpen}
        onClose={onClose}
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
    );
  }
);
