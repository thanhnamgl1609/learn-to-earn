import { ChangeEvent, InputHTMLAttributes, memo, useCallback } from 'react';

type Props = {} & InputHTMLAttributes<HTMLInputElement>;

const InputFile = (props: Props) => (
  <div className="flex text-sm text-gray-600">
    <label
      htmlFor={props.id}
      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
    >
      <span>Upload a file</span>
      <input type="file" className="sr-only" {...props} />
    </label>
    <p className="pl-1">or drag and drop</p>
  </div>
);

export default memo(InputFile);
