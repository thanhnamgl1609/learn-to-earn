import { InputHTMLAttributes, memo, useCallback } from 'react';
import { cls } from 'utils';
import { InputImage, PreviewImages } from '@molecules';

type Props = {
  images: string[];
  containerClassName?: string;
  labelClassName?: string;
  previewClassName?: string;
  label?: string;
  id: string;
  onRemove: (image: string) => void;
} & InputHTMLAttributes<HTMLInputElement>;

const InputMultipleImages = ({
  images,
  containerClassName,
  labelClassName,
  previewClassName,
  label = 'Image',
  onRemove,
  ...props
}: Props) => {
  const _onRemove = useCallback(
    (image: string) => () => onRemove(image),
    [onRemove]
  );

  return (
    <div className={cls(containerClassName)}>
      <label
        htmlFor={props.id}
        className={cls(
          'block text-sm font-medium text-gray-700',
          labelClassName
        )}
      >
        {label}
      </label>

      <InputImage {...props} />
      <PreviewImages
        images={images}
        className={previewClassName}
        onRemove={_onRemove}
        containerClassName="mt-4"
      />
    </div>
  );
};

export default memo(InputMultipleImages);
