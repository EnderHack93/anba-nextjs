"use client";
import { noto } from "@/config/fonts";
import { useUIStore } from "@/admin";
import Link from "next/link";
import {
  IoCartOutline,
  IoMenuOutline,
  IoPersonCircleOutline,
  IoSearchOutline,
} from "react-icons/io5";

export const TopMenu = () => {
  const openMenu = useUIStore((state) => state.openSideMenu);

  return (
    <div className=" rounded-b-2xl shadow-2xl bg-white">
      <nav className="flex px-5 max-h-20 justify-between items-center w-full text-2xl">
      <div className="">
        <Link href={"/"}>
          <span className={`${noto.className} antialiased`}>
            ANBA
          </span>
          <span> | Académico</span>
        </Link>
      </div>

      <div className="flex items-center">
        <Link href="/profile" className="mx-2 hover:shadow-2xl">
          <div className="flex items-center">
            <span className="hidden sm:block me-2">Perfil</span>
            <IoPersonCircleOutline className="w-9 h-9 "/>
          </div>
        </Link>

        <button
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          onClick={() => openMenu()}
        >
          <div className="flex items-center">
            <span className="hidden sm:block me-2">Menu</span>
            <IoMenuOutline className="w-10 h-10 "/>
          </div>
        </button>
      </div>
    </nav>
    </div>
  );
};
