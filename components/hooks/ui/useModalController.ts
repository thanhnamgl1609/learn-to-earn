import { useCallback, useState } from 'react';

type UseModalControllerReturnType = [
  boolean,
  () => void,
  () => void,
  () => void
];

export const useModalController = (
  openAtFirst = false
): UseModalControllerReturnType => {
  const [isOpen, setIsOpen] = useState(openAtFirst);
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);
  const toggle = useCallback(() => {
    setIsOpen((_isOpen) => !_isOpen);
  }, []);

  return [isOpen, open, close, toggle];
};
