import NextImage from 'next/image';
import { ComponentProps, memo } from 'react';
import { XCircleIcon } from '@heroicons/react/solid';
import { Image } from '..';

type Props = {
  className?: string;
  containerClassName?: string;
  canZoomIn?: boolean;
  onRemove: () => void;
} & ComponentProps<typeof NextImage>;

const ClosableImage = ({ containerClassName, onRemove, ...props }: Props) => (
  <div
    className={['group relative inline-block', containerClassName].filter(Boolean).join(' ')}
  >
    <Image {...props} />
    <XCircleIcon
      className="cursor-pointer opacity-0 text-white group-hover:opacity-100 absolute top-1 right-1 w-[32px] h-[32px] transition-opacity duration-300"
      onClick={onRemove}
    />
  </div>
);

export default memo(ClosableImage);
