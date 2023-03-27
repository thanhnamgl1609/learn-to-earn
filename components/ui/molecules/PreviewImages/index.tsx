import { memo } from 'react';
import { RemovableImage } from '@atoms';

type Props = {
  containerClassName: string;
  className?: string;
  images: string[];
  onRemove: (image: string) => () => void;
};

const PreviewImages = ({ containerClassName, className, images, onRemove }: Props) => (
  <div
    className={`
    ${containerClassName}
    grid grid-cols-2 gap-2 md:grid-cols-4 sm:grid-cols-3
    `}
  >
    {images.map((image) => (
      <RemovableImage
        alt=""
        className={className}
        key={image}
        src={image}
        onRemove={onRemove(image)}
        canZoomIn
      />
    ))}
  </div>
);

export default memo(PreviewImages);
