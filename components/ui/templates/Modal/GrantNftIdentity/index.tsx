import { FC, memo, useState } from 'react';
import { connect } from 'react-redux';

import { NftClassRegistration } from '@_types/school';
import { useFormSubmit, useInputTextChange } from '@hooks/form';
import { Modal } from '../BaseModal';
import { InputField } from '@molecules';
import { Form } from '@organisms';

type Props = {
  nftClassRegistration?: NftClassRegistration;
};

const createDefaultState = () => ({
  score: 0,
});

export const GrantNftIdentityModal: FC<Props> = memo(
  ({ nftClassRegistration }) => {
    const [formState, setFormState] = useState(createDefaultState());
    const isGrantNftIdentityModalOpen = false;
    const onInputChange = useInputTextChange(setFormState);
    const onSubmit = useFormSubmit(() => console.log('hello'), []);
    if (!nftClassRegistration) return null;
    const { classInfo } = nftClassRegistration.meta;
    const { course } = classInfo.meta;

    return (
      <Modal isOpen={isGrantNftIdentityModalOpen}>
        <Form onSubmit={onSubmit}>
          <InputField label="Mã lớp học" value={nftClassRegistration.classId} />
          <InputField label="Môn học" value={course.name} />

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
