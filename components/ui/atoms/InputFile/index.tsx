import { ChangeEvent, memo, useCallback } from 'react';

type Props = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const InputFile = ({ onChange }: Props) => {
  const _onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => onChange(e), [onChange]);

  return (
    <div className="flex text-sm text-gray-600">
      <label
        htmlFor="file-upload"
        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
      >
        <span>Upload a file</span>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          onChange={_onChange}
          className="sr-only"
        />
      </label>
      <p className="pl-1">or drag and drop</p>
    </div>
  );
};

export default memo(InputFile);
