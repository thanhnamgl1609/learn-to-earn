import {
  FC,
  HTMLAttributes,
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { XIcon } from '@heroicons/react/solid';
import { FlexDiv } from '@atoms';

type Props = {
  isOpen: boolean;
  onClose: () => void;
} & HTMLAttributes<HTMLDivElement>;

const Modal: FC<PropsWithChildren<Props>> = ({
  children,
  className,
  onClose,
  isOpen,
  ...props
}) => {
  const [visible, setVisible] = useState<'visible' | 'invisible'>('invisible');
  const _className = useMemo(
    () =>
      [
        'relative z-[999] overflow-auto max-h-[100vh]',
        className,
        !isOpen ? 'animate-zoomOut' : 'animate-zoomIn',
      ]
        .filter(Boolean)
        .join(' '),
    [className, isOpen]
  );
  const stopPropagation = useCallback(
    (e: MouseEvent<HTMLDivElement>) => e.stopPropagation(),
    []
  );
  useEffect(() => {
    console.log(isOpen);
    if (isOpen) {
      setVisible('visible');
    } else {
      setTimeout(() => setVisible('invisible'), 300);
    }
  }, [onClose, isOpen]);

  return (
    <FlexDiv
      className={[
        'fixed top-0 right-0 left-0 bottom-0 z-[1000] transition-opacity duration-300',
        !isOpen && 'opacity-0',
        visible,
      ]
        .filter(Boolean)
        .join(' ')}
      center
    >
      <div
        className="absolute top-0 right-0 left-0 bottom-0 bg-black opacity-20"
        onClick={onClose}
      />
      <div className={_className} {...props} onClick={stopPropagation}>
        {children}
        <XIcon
          className="absolute top-[12px] right-[12px] w-[16px] p-[4px] box-content text-gray-600 cursor-pointer hover:opacity-80 active:opacity-60"
          onClick={onClose}
        />
      </div>
    </FlexDiv>
  );
};
export default Modal;
