import { Button } from '@atoms';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { GroupTwoButtons } from '@molecules';
import {
  closeConfirmModal,
  openConfirmModal,
  selectApp,
} from '@store/appSlice';
import { memo } from 'react';
import { Modal } from '../BaseModal';

export const ConfirmDialog = memo(() => {
  const { confirmDialog } = useAppSelector(selectApp);
  const dispatch = useAppDispatch();
  const onClose = () => dispatch(closeConfirmModal());
  const onAccept = async () => {
    await confirmDialog.onAccept();
    dispatch(closeConfirmModal());
  };

  return (
    <Modal
      closable={false}
      isOpen={confirmDialog.isOpen}
      containerClassName="z-[9999]"
      className="min-w-[240px] bg-white rounded overflow-hidden"
    >
      <div className="bg-gray-800 text-white p-2">{confirmDialog.header}</div>
      <div className="px-4 py-3">
        <p className="">{confirmDialog.content}</p>
        <GroupTwoButtons
          className="mt-4"
          firstClassName="ml-auto"
          firstLabel={confirmDialog.rejectText}
          secondLabel={confirmDialog.acceptText}
          onClickFirst={onClose}
          onClickSecond={onAccept}
          main={2}
        />
      </div>
    </Modal>
  );
});
