import { InputHTMLAttributes, memo, useMemo } from 'react';
import { Input } from '@atoms';
import { cls } from 'utils';

type Props = {
  label: string;
  containerClassName?: string;
  labelClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const InputField = ({
  label,
  containerClassName,
  labelClassName,
  ...props
}: Props) => {
  const inputProps = useMemo(() => {
    const { ...defaultProps } = props;

    if (defaultProps.readOnly) delete defaultProps.onChange;

    return defaultProps;
  }, [props]);

  return (
    <div className={containerClassName}>
      <label
        htmlFor={`field_${inputProps.name}`}
        className={cls(
          'block text-sm font-medium text-gray-700',
          labelClassName
        )}
      >
        {label}
      </label>
      <Input id={`field_${inputProps.name}`} className="mt-1" {...inputProps} />
    </div>
  );
};

export default memo(InputField);
