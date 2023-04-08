import { InputHTMLAttributes, memo } from 'react';
import { FlexDiv, RemovableImage } from '@atoms';
import { InputImage } from '@molecules';

type Props = {
  image: string;
  previewClassName?: string;
  label?: string;
  id: string;
  onRemove: () => void;
} & InputHTMLAttributes<HTMLInputElement>;

const InputSingleImage = ({
  image,
  previewClassName,
  label = 'Image',
  onRemove,
  ...props
}: Props) => (
  <div>
    <label htmlFor={props.id} className="mb-1 block text-sm font-medium text-gray-700">
      {label}
    </label>

    {!image ? (
      <InputImage {...props} />
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
export default memo(InputSingleImage);
