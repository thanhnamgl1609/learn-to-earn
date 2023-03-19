import NextImage from 'next/image';
import { memo, useCallback, useEffect, useState } from 'react';

type Props = {
  src: string;
  width?: number;
  height?: number;
  alt: string;
  canZoomIn?: boolean;
};

const Image = ({ src, width, height, alt, canZoomIn = false }: Props) => {
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
        className={`${canZoomIn && 'cursor-zoom-in'}`}
        src={src}
        width={width || '500'}
        height={height || '500'}
        alt={alt || ''}
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
          <img src={src} alt={alt || ''} />
        </div>
      </div>
    </>
  );
};

export default memo(Image);
