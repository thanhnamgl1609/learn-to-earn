import { memo } from 'react';

const SearchBar = ({
  className = '',
  value,
  onChange,
  placeholder = '',
}) => (
  <div
    className={`relative flex w-full flex-wrap items-stretch ${className}`}
  >
    <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
      <i className="fas fa-search"></i>
    </span>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
    />
  </div>
);

export default memo(SearchBar);
