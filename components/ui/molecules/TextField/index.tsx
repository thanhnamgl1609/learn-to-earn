import { TextareaHTMLAttributes, memo, useMemo } from 'react';
import { TextArea } from '@atoms';

type Props = {
  label: string;
  containerClassName?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextField = ({ label, containerClassName, ...props }: Props) => {
  const inputProps = useMemo(() => {
    const { ...defaultProps } = props;

    if (defaultProps.readOnly) delete defaultProps.onChange;

    return defaultProps;
  }, [props]);

  return (
    <div className={containerClassName}>
      <label
        htmlFor={`field_${inputProps.name}`}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <TextArea
        id={`field_${inputProps.name}`}
        className="mt-1"
        {...inputProps}
      />
    </div>
  );
};

export default memo(TextField);
