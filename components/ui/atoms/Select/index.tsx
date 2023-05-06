import { SelectHTMLAttributes, memo } from 'react';

type Option = {
  label: string;
  value: string | number;
};

type Props = {
  className?: string;
  options?: Option[];
} & SelectHTMLAttributes<HTMLSelectElement>;

const Select = ({ className, options, ...props }: Props) => {
  return (
    <div className={`${className} flex rounded-md shadow-sm`}>
      <select
        className={`focus:ring-indigo-500 focus:border-indigo-500
        flex-1 block w-full sm:text-sm px-2 py-1
        border-gray-300 border rounded outline-none
        disabled:bg-gray-200 disabled:text-black
        disabled:border-none disabled:outline-none
        disabled:cursor-default`}
        {...props}
      >
        {options.map(({ label, value }) => (
          <option value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
};

export default memo(Select);
