import { FC, memo, useState } from 'react';
import { connect } from 'react-redux';

import { NftClassRegistration } from '@_types/school';
import { useFormSubmit, useInputTextChange } from '@hooks/form';
import { Modal } from '../BaseModal';
import { InputField, LinkField } from '@molecules';
import { Form } from '@organisms';
import { NftClassRegistrationEntity } from '@_types/models/entities';
import { useGrantNftCompleteCourse } from '@hooks/common';
import { NftClassRegistrationEntityWithApproveStatus } from '@_types/api/class';

type Props = {
  nftClassRegistration?: NftClassRegistrationEntityWithApproveStatus | null;
  isOpen: boolean;
  onClose: () => void;
};

const createDefaultState = () => ({
  avgScore: '0',
});

export const GrantNftIdentityModal: FC<Props> = memo(
  ({ isOpen, onClose, nftClassRegistration }) => {
    const grantNftCompleteCourse = useGrantNftCompleteCourse();
    const [formState, setFormState] = useState(createDefaultState());
    const onInputChange = useInputTextChange(setFormState);
    const onSubmit = useFormSubmit(
      () => grantNftCompleteCourse(nftClassRegistration, formState.avgScore),
      [nftClassRegistration, formState]
    );
    if (!nftClassRegistration) return null;

    return (
      <Modal
        className="w-[640px] bg-white overflow-auto rounded"
        isOpen={isOpen}
        onClose={onClose}
      >
        <Form
          onSubmit={onSubmit}
          submitText="Cấp NFT"
          disabled={
            nftClassRegistration.isRegained && !nftClassRegistration.isInQueue
          }
        >
          <InputField
            label="Mã môn học"
            value={nftClassRegistration.class.course.onChainId}
            readOnly
          />
          <InputField
            label="Tên môn học"
            value={nftClassRegistration.class.course.name}
            readOnly
          />
          <InputField
            label="Mã sinh viên"
            value={nftClassRegistration.studentTokenId}
            readOnly
          />
          <InputField
            label="Tên sinh viên"
            value={nftClassRegistration.student.fullName}
            readOnly
          />
          <LinkField
            label="Metadata"
            href={nftClassRegistration.chainURI}
            target="_blank"
            text={nftClassRegistration.chainURI}
          />

          <InputField
            label="Điểm trung bình"
            name="avgScore"
            onChange={onInputChange}
            value={formState.avgScore}
          />
        </Form>
      </Modal>
    );
  }
);
