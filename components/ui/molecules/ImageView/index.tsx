import { Image } from '@atoms';
import { FC, memo } from 'react';
import { cls } from 'utils';

type Props = any;

const ImageView: FC<Props> = ({
  label,
  images,
  labelClassName,
  containerClassName,
  imageContainerClassName,
  ...props
}) => (
  <div className={cls(containerClassName)}>
    <label
      className={cls(
        'mb-1 block text-sm font-medium text-gray-700',
        labelClassName
      )}
    >
      {label}
    </label>
    <div
      className={cls(
        `
          grid grid-cols-2 gap-2 md:grid-cols-4 sm:grid-cols-3
        `,
        imageContainerClassName
      )}
    >
      {images.map(({ src, alt }) => (
        <Image
          key={src}
          className="hover:opacity-80"
          src={src}
          alt={alt}
          {...props}
        />
      ))}
    </div>
  </div>
);

export default memo(ImageView);
