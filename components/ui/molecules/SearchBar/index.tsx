import { memo } from 'react';
import { Button } from '@atoms';

const Wrapper = ({ submitable, onSubmit, className, children }) =>
  submitable ? (
    <form
      className={`relative flex w-full flex-wrap items-stretch ${className}`}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  ) : (
    <div
      className={`relative flex w-full flex-wrap items-stretch ${className}`}
    >
      {children}
    </div>
  );

const SearchBar = ({
  className = '',
  value,
  onChange,
  submitText = 'Submit',
  onSubmit = null,
  submitable = false,
  ...props
}) => (
  <Wrapper
    onSubmit={onSubmit}
    submitable={submitable}
    className={className}
  >
    <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
      <i className="fas fa-search"></i>
    </span>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
      {...props}
    />
    {submitable && (
      <Button type="submit" theme="main" className="">
        {submitText}
      </Button>
    )}
  </Wrapper>
);

export default memo(SearchBar);
