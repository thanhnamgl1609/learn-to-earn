import { InputHTMLAttributes, memo } from 'react';
import { FlexDiv, RemovableImage } from '@atoms';
import { InputImage } from '@molecules';
import { cls } from 'utils';

type Props = {
  image: string;
  previewClassName?: string;
  containerClassName?: string;
  label?: string;
  labelClassName?: string;
  id: string;
  onRemove: () => void;
} & InputHTMLAttributes<HTMLInputElement>;

const InputSingleImage = ({
  image,
  previewClassName,
  labelClassName,
  containerClassName,
  label = 'Image',
  onRemove,
  ...props
}: Props) => (
  <div className={cls(containerClassName)}>
    <label
      htmlFor={props.id}
      className={cls(
        'mb-1 block text-sm font-medium text-gray-700',
        labelClassName
      )}
    >
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
