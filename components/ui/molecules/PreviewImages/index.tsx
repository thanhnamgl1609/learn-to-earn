import { memo } from 'react';
import { XCircleIcon } from '@heroicons/react/solid';
import { Image } from '@atoms';

type Props = {
  containerClassName: string;
  images: string[];
  onRemove: (image: string) => () => void;
};

const PreviewImages = ({ containerClassName, images, onRemove }: Props) => (
  <div
    className={`
    ${containerClassName}
    grid grid-cols-2 gap-2 md:grid-cols-4 sm:grid-cols-3
    `}
  >
    {images.map((image) => (
      <div className="group relative cursor-zoom-in" key={image}>
        <Image src={image} alt="" canZoomIn />
        <XCircleIcon
          className="cursor-pointer opacity-0 group-hover:opacity-100 absolute top-1 right-1 w-[32px] h-[32px] transition-opacity duration-300"
          onClick={onRemove(image)}
        />
      </div>
    ))}
  </div>
);

export default memo(PreviewImages);
