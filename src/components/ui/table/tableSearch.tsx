import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

interface props {
  value:string
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>)=> void
}


export const TableSearch:React.FC<props> = ({value,onSearchChange}) => {
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <IoSearchOutline className="w-6 h-6"/>
      <input
        type="text"
        placeholder="Buscar..."
        onChange={onSearchChange}
        value={value}
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </div>
  );
};
