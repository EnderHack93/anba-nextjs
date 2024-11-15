"use client";
import { useSession, signOut } from "next-auth/react";
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
import Swal from "sweetalert2";

export const Sidebar = () => {
  const { data: session } = useSession(); // Obtener la sesión del usuario
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);

  const userRole = session?.user?.rol; // Obtener el rol del usuario

  // Opciones del menú para cada rol
  const adminLinks = [
    { href: "/estudiantes", label: "Estudiantes", icon: <IoPeopleOutline size={30} /> },
    { href: "/docentes", label: "Docentes", icon: <IoPeopleOutline size={30} /> },
    { href: "/especialidades", label: "Especialidades", icon: <IoPricetagsOutline size={30} /> },
    { href: "/materias", label: "Materias", icon: <IoBookmarksOutline size={30} /> },
    { href: "/clases", label: "Clases", icon: <IoCalendarOutline size={30} /> },
  ];

  const docenteLinks = [
    { href: "/asistencia", label: "Asistencias", icon: <IoCalendarOutline size={30} /> },
    { href: "/notas", label: "Notas", icon: <IoBookmarksOutline size={30} /> },
  ];

  // Determinar los enlaces a mostrar según el rol del usuario
  const linksToShow = userRole === "ADMIN" ? adminLinks : docenteLinks;

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

          {/* Renderizar enlaces dinámicamente */}
          {linksToShow.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
            >
              {link.icon}
              <span className="ml-3 text-lg">{link.label}</span>
            </Link>
          ))}

          <div className="w-full rounded h-px bg-gray-200 my-6" />

          {/* Link para cerrar sesión */}
          <Link
            href=""
            className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
            onClick={() => {
              Swal.fire({
                title: "¿Estás seguro de cerrar sesión?",
                text: "Tu sesión actual se cerrará y serás redirigido a la página de inicio de sesión.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, cerrar sesión",
                cancelButtonText: "Cancelar",
                focusCancel: true, // Enfoca el botón de cancelar para prevenir clics accidentales en "Sí"
                customClass: {
                  popup: "rounded-xl bg-white shadow-lg",
                  title: "text-lg font-semibold text-gray-800",
                  htmlContainer: "text-sm text-gray-600",
                  confirmButton:
                    "px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300",
                  cancelButton:
                    "px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-300",
                },
              }).then((result) => {
                if (result.isConfirmed) {
                  signOut({ callbackUrl: "/auth/login" });
                }
              });
            }}
          >
            <IoLogOutOutline size={30} />
            <span className="ml-3 text-lg">Cerrar sesión</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};
