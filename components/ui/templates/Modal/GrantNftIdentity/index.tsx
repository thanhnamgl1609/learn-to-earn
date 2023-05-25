import { FC, memo, useState } from 'react';
import { connect } from 'react-redux';

import { NftClassRegistration } from '@_types/school';
import { useFormSubmit, useInputTextChange } from '@hooks/form';
import { Modal } from '../BaseModal';
import { InputField, LinkField } from '@molecules';
import { Form } from '@organisms';
import { NftClassRegistrationEntity } from '@_types/models/entities';

type Props = {
  nftClassRegistration?: NftClassRegistrationEntity | null;
  isOpen: boolean;
  onClose: () => void;
};

const createDefaultState = () => ({
  score: 0,
});

export const GrantNftIdentityModal: FC<Props> = memo(
  ({ isOpen, onClose, nftClassRegistration }) => {
    const [formState, setFormState] = useState(createDefaultState());
    const onInputChange = useInputTextChange(setFormState);
    const onSubmit = useFormSubmit(() => console.log('hello'), []);
    if (!nftClassRegistration) return null;

    return (
      <Modal
        className="w-[640px] bg-white overflow-auto rounded"
        isOpen={isOpen}
        onClose={onClose}
      >
        <Form onSubmit={onSubmit}>
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
            name="score"
            onChange={onInputChange}
            value={formState.score}
          />
        </Form>
      </Modal>
    );
  }
);
