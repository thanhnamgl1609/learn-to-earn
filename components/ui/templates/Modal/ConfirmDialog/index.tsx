import { memo } from 'react';

import { cls } from 'utils';
import { useAppDispatch, useAppSelector } from '@hooks/stores';
import { GroupTwoButtons } from '@molecules';
import { closeConfirmModal, selectApp } from '@store/appSlice';
import CONST from 'config/constants.json';
import { Modal } from '../BaseModal';

const {
  UI: { CONFIRM_DIALOG_LEVEL },
} = CONST;

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
      <div
        className={cls('p-2 font-bold', {
          'bg-gray-800 text-white':
            confirmDialog.type === CONFIRM_DIALOG_LEVEL.INFO,
          'bg-yellow-400 text-white':
            confirmDialog.type === CONFIRM_DIALOG_LEVEL.WARNING,
        })}
      >
        {confirmDialog.header}
      </div>
      <div className="px-4 py-3">
        <p className="">{confirmDialog.content}</p>
        <GroupTwoButtons
          className="mt-4"
          firstClassName="ml-auto"
          secondClassName={cls({
            'bg-gray-800 text-white':
              confirmDialog.type === CONFIRM_DIALOG_LEVEL.INFO,
            'bg-yellow-400 text-white hover:bg-yellow-500':
              confirmDialog.type === CONFIRM_DIALOG_LEVEL.WARNING,
          })}
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
