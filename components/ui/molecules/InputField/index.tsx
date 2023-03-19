import { ChangeEvent, memo } from 'react';
import { Input } from '@atoms';

type Props = {
  label: string;
  name: string;
  placeholder: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const InputField = ({ label, name, placeholder, value, onChange }: Props) => {
  return (
    <div>
      <label
        htmlFor={`field_${name}`}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <Input
        id={`field_${name}`}
        className="mt-1"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default memo(InputField);
