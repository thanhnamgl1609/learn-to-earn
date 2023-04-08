import { InputHTMLAttributes, memo, useCallback } from 'react';
import { InputImage, PreviewImages } from '@molecules';

type Props = {
  images: string[];
  previewClassName?: string;
  label?: string;
  id: string;
  onRemove: (image: string) => void;
} & InputHTMLAttributes<HTMLInputElement>;

const InputMultipleImages = ({
  images,
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
    <div>
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700"
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
