import { FC, memo, useState } from 'react';
import { connect } from 'react-redux';

import CONST from 'config/constants.json';
import { useFormSubmit, useInputTextChange } from '@hooks/form';
import { useAppDispatch } from '@hooks/stores';
import { useUpdateScore } from '@hooks/common';
import { InputField, LinkField } from '@molecules';
import { Form } from '@organisms';
import { openConfirmModal } from '@store/appSlice';
import { NftClassRegistrationEntityWithApproveStatus } from '@_types/api/class';
import { Modal } from '../BaseModal';
import { toast } from 'react-toastify';

type Props = {
  nftClassRegistration?: NftClassRegistrationEntityWithApproveStatus | null;
  isOpen: boolean;
  onClose: () => void;
  onRefreshStudents: () => Promise<void>;
};

const { MINIMUM_SCORE_FOR_GRADUATION } = CONST;

const createDefaultState = () => ({
  avgScore: '0',
});

export const UpdateScoreModal: FC<Props> = memo(
  ({ isOpen, onClose, nftClassRegistration, onRefreshStudents }) => {
    const updateScore = useUpdateScore();
    const [formState, setFormState] = useState(createDefaultState());
    const dispatch = useAppDispatch();
    const onInputChange = useInputTextChange(setFormState);
    const onSubmit = useFormSubmit(() => {
      const score = parseInt(formState.avgScore);

      if (Number.isNaN(score)) {
        toast.error('Điêm không hợp lệ');
        return;
      }

      const caller = async () => {
        await updateScore({
          score,
          nftClassRegistration,
        });
        onClose();
        await onRefreshStudents();
      };
      dispatch(
        openConfirmModal({
          type: 'info',
          header: 'Chú ý',
          content:
            score < MINIMUM_SCORE_FOR_GRADUATION ? (
              <>
                <p>Điểm số: {score}</p>
                <p>
                  Vì điếm dưới 5 nên sinh viên sẽ{' '}
                  <b>không nhận được</b> NFT hoàn thành môn
                </p>
                <p>Bạn có chắc chắn không?</p>
              </>
            ) : (
              <>
                <p>Điểm số: {score}</p>
                <p>Bạn có chắc chắn không?</p>
              </>
            ),
          onAccept: caller,
        })
      );
    }, [nftClassRegistration, formState]);
    if (!nftClassRegistration) return null;

    return (
      <Modal
        className="w-[640px] bg-white overflow-auto rounded"
        isOpen={isOpen}
        onClose={onClose}
      >
        <Form
          onSubmit={onSubmit}
          submitText="Cập nhật"
          disabled={!!nftClassRegistration.isRegained}
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
