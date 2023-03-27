import { InputHTMLAttributes, memo } from 'react';

type Props = {
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...props }: Props) => {
  return (
    <div className={`${className} flex rounded-md shadow-sm`}>
      <input
        type="text"
        className={`focus:ring-indigo-500 focus:border-indigo-500
        flex-1 block w-full sm:text-sm px-2 py-1
        border-gray-300 border rounded outline-none
        read-only:bg-gray-200 read-only:text-black
        read-only:border-none read-only:outline-none
        read-only:cursor-default`}
        {...props}
      />
    </div>
  );
};

export default memo(Input);
