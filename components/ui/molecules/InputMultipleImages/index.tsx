import { ChangeEvent, memo, useCallback } from 'react';
import { InputImage, PreviewImages } from '@molecules';

type Props = {
  images: string[];
  previewClassName?: string;
  label?: string;
  onRemove: (image: string) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const InputMultipleImages = ({
  images,
  previewClassName,
  label = 'Image',
  onRemove,
  onChange,
}: Props) => {
  const _onRemove = useCallback(
    (image: string) => () => onRemove(image),
    [onRemove]
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <InputImage onChange={onChange}  />
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
