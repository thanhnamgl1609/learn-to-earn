import { ChangeEvent, memo } from 'react';

type Props = {
  id?: string;
  className: string;
  name: string;
  value: string | number;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({ id, className, name, placeholder, value, onChange }: Props) => {
  return (
    <div className={`${className} flex rounded-md shadow-sm`}>
      <input
        type="text"
        name={name}
        id={id || name}
        onChange={onChange}
        value={value}
        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 border rounded px-2 py-1 outline-none"
        placeholder={placeholder}
      />
    </div>
  );
};

export default memo(Input);
