import NextImage from 'next/image';
import {
  ComponentProps,
  ImgHTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';

type Props = {
  canZoomIn?: boolean;
} & ComponentProps<typeof NextImage>;

const Image = ({ canZoomIn = false, width, height, ...props }: Props) => {
  const [zoomIn, setZoomIn] = useState(false);
  const [visible, setVisible] = useState('invisible');

  const toggleZoom = useCallback(() => {
    if (!canZoomIn) return;

    setZoomIn((_zoomIn) => !_zoomIn);
  }, [canZoomIn]);

  useEffect(() => {
    let timeoutId;
    if (!zoomIn) {
      timeoutId = setTimeout(() => setVisible('invisible'), 300);
    } else {
      setVisible('visible');
    }

    return () => clearTimeout(timeoutId);
  }, [zoomIn]);

  return (
    <>
      <NextImage
        {...props}
        width={width || '500'}
        height={height || '500'}
        className={`${canZoomIn && 'cursor-zoom-in'} ${props.className}`}
        onClick={toggleZoom}
        onDragStart={(e) => e.preventDefault()}
      />
      <div
        className={`
          fixed inset-0
          p-[15px]
          ${visible}
          ${zoomIn ? 'opacity-100' : 'opacity-0'}
          flex justify-center items-center z-[1000]
          transition-opacity duration-300
          cursor-default
        `}
        onClick={toggleZoom}
      >
        <div className="absolute inset-0 bg-black/20 -z-10"></div>
        <div
          className={`${zoomIn ? 'animate-zoomIn' : 'animate-zoomOut'}
          bg-white cursor-zoom-out select-none`}
        >
          <img src={props.src as string} alt={props.alt || ''} />
        </div>
      </div>
    </>
  );
};

export default memo(Image);
