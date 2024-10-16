"use client";
import { useUIStore } from "@/admin";
import clsx from "clsx";
import Link from "next/link";
import {
  IoBookmarksOutline,
  IoCalendarOutline,
  IoCloseOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPricetagsOutline,
  IoSearchOutline,
} from "react-icons/io5";

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);

  return (
    <div className="">
      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
      )}

      {isSideMenuOpen && (
        <div
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      <nav
        className={clsx(
          "fixed right-0 top-0 w-screen sm:w-[500px] bg-white z-20 shadow-2xl transform transition-all duration-300 h-screen overflow-hidden",
          {
            "translate-x-full": !isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          size={50}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={closeMenu}
        />

        {/* Container for scrolling content */}
        <div className="h-full overflow-y-auto mt-14 p-5">
          <div className="relative mb-5">
            <IoSearchOutline size={20} className="absolute top-2 left-2" />
            <input
              type="text"
              placeholder="Buscar"
              className="w-full bg-gray-50 rounded pl-10 py-2 pr-4 border-b-2 text-lg border-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <Link
            href="/estudiantes"
            className="flex items-center p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoPeopleOutline size={30} />
            <span className="ml-3 text-lg">Estudiantes</span>
          </Link>

          <Link
            href="/docentes"
            className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoPeopleOutline size={30} />
            <span className="ml-3 text-lg">Docentes</span>
          </Link>

          <Link
            href="/especialidades"
            className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoPricetagsOutline size={30} />
            <span className="ml-3 text-lg">Especialidades</span>
          </Link>

          <Link
            href="/materias"
            className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoBookmarksOutline size={30} />
            <span className="ml-3 text-lg">Materias</span>
          </Link>

          <Link
            href="/clases"
            className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoCalendarOutline size={30} />
            <span className="ml-3 text-lg">Clases</span>
          </Link>

          <div className="w-full rounded h-px bg-gray-200 my-6" />

          {/* Link for closing session */}
          <Link
            href="/"
            className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoLogOutOutline size={30} />
            <span className="ml-3 text-lg">Cerrar sesión</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};
