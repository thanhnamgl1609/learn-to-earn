import { SelectHTMLAttributes, memo, useMemo } from 'react';
import { Select } from '@atoms';

type Option = {
  label: string;
  value: string | number;
}

type Props = {
  label: string;
  containerClassName?: string;
  options: Option[];
} & SelectHTMLAttributes<HTMLSelectElement>;

const SelectField = ({ label, containerClassName, ...props }: Props) => {
  const selectProps = useMemo(() => {
    const { ...defaultProps } = props;

    if (defaultProps.disabled) delete defaultProps.onChange;

    return defaultProps;
  }, [props]);

  return (
    <div className={containerClassName}>
      <label
        htmlFor={`field_${selectProps.name}`}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <Select
        id={`field_${selectProps.name}`}
        className="mt-1"
        {...selectProps}
      />
    </div>
  );
};

export default memo(SelectField);
