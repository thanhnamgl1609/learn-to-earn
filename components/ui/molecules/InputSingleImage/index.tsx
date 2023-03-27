import { ChangeEvent, memo, useCallback } from 'react';
import { FlexDiv, RemovableImage } from '@atoms';
import { InputImage } from '@molecules';

type Props = {
  image: string;
  previewClassName?: string;
  label?: string;
  onRemove: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const InputSingleImage = ({
  image,
  previewClassName,
  label = 'Image',
  onRemove,
  onChange,
}: Props) => {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      {!image ? (
        <InputImage onChange={onChange} />
      ) : (
        <FlexDiv center>
          <RemovableImage
            alt=""
            className={previewClassName}
            key={image}
            src={image}
            onRemove={onRemove}
            canZoomIn
          />
        </FlexDiv>
      )}
    </div>
  );
};

export default memo(InputSingleImage);
