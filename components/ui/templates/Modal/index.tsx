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
  darkPercent?: 0 | 5 | 10 | 20 | 25 | 30 | 40 | 50 | 60 | 70 | 80 | 90;
  onClose?: () => void;
  closable?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const Modal: FC<PropsWithChildren<Props>> = ({
  children,
  className,
  darkPercent = 20,
  onClose,
  isOpen,
  closable = true,
  ...props
}) => {
  const [visible, setVisible] = useState<'visible' | 'invisible'>('invisible');
  const _className = useMemo(
    () =>
      [
        'relative z-[999] max-h-[100vh]',
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
  const _onClose = useCallback(
    () => (closable ? onClose() : null),
    [closable, onClose]
  );
  useEffect(() => {
    if (isOpen) {
      setVisible('visible');
    } else {
      setTimeout(() => setVisible('invisible'), 300);
    }
  }, [isOpen]);

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
        className={`absolute top-0 right-0 left-0 bottom-0 bg-black/${darkPercent}`}
        onClick={_onClose}
      />
      <div className={_className} {...props} onClick={stopPropagation}>
        {children}
        {closable && (
          <XIcon
            className="absolute top-[12px] right-[12px] w-[16px] p-[4px] box-content text-gray-600 cursor-pointer hover:opacity-80 active:opacity-60"
            onClick={_onClose}
          />
        )}
      </div>
    </FlexDiv>
  );
};
export default Modal;
