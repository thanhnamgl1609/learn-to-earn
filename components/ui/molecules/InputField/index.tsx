import { ChangeEvent, InputHTMLAttributes, memo, useMemo } from 'react';
import { Input } from '@atoms';

type Props = {
  label: string;
  containerClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const InputField = ({ label, containerClassName, ...props }: Props) => {
  const inputProps = useMemo(() => {
    const { ...defaultProps } = props;

    if (defaultProps.readOnly) delete defaultProps.onChange;

    return defaultProps;
  }, [props]);

  return (
    <div className={containerClassName}>
      <label
        htmlFor={`field_${name}`}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <Input id={`field_${inputProps.name}`} className="mt-1" {...inputProps} />
    </div>
  );
};

export default memo(InputField);
