/** @format */

import { cn } from "@/utils/cn";
import React from "react";
import { IoSearch } from "react-icons/io5";

type Props = {
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

const SearchBox: React.FC<Props> = ({ className, value, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className={cn("flex relative items-center justify-center h-10", className)}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search location..."
        className="px-4 py-2 w-[230px] border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500 h-full"
      />
      <button
        type="submit"
        className="px-4 py-[9px] bg-blue-500 text-white rounded-r-md focus:outline-none hover:bg-blue-600 h-full"
        aria-label="Search"
      >
        <IoSearch />
      </button>
    </form>
  );
};

export default SearchBox;