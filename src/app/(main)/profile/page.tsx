"use client";
import { useSession } from "next-auth/react";
import UnauthorizedScreen from "@/components/ui/unautorized/page";
import LoadingScreen from "@/components/ui/loading-page/page";
import { useEffect, useState } from "react";
import { fetchProfileInfo } from "@/services/user/profile";
import { ProfileUser } from "@/interfaces/entidades/profile";
import { Docente } from "@/interfaces/entidades/docente";
import { Estudiante } from "@/interfaces/entidades/estudiante";
import Image from "next/image";
import { Administrador } from "@/interfaces/entidades/administrador";

// Type guard para verificar si el usuario es Docente o Estudiante
const hasEspecialidad = (
  info: Docente | Estudiante | Administrador
): info is Docente | Estudiante => "especialidad" in info;

const PerfilUsuario = () => {
  const { data: session, status } = useSession();
  const [perfil, setPerfil] = useState<
    ProfileUser<Docente | Estudiante | Administrador> | null
  >(null);

  const fetchInfo = async () => {
    if (session?.user.accessToken) {
      const response = await fetchProfileInfo(session?.user.accessToken);
      if (response) {
        setPerfil(response);
      }
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchInfo();
    }
  }, [status]);

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (
    status === "unauthenticated" ||
    (session?.user?.rol !== "ADMIN" &&
      session?.user?.rol !== "DOCENTE" &&
      session?.user?.rol !== "ESTUDIANTE")
  ) {
    return <UnauthorizedScreen />;
  }

  return (
    <div className="flex items-center  justify-center h-full mt-4 ">
      <div className="max-w-3xl w-full mx-4 shadow-lg rounded-lg bg-white h-full p-6">
        {/* Información del usuario */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Imagen de perfil */}
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
            <Image
              src={perfil?.info.img_perfil || "/images/avatar.png"}
              width={500}
              height={500}
              alt="Imagen del perfil"
            />
          </div>

          {/* Detalles del usuario */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">
              {perfil?.info.nombres} {perfil?.info.apellidos}
            </h1>
            <p className="text-gray-600 mt-1">
              <strong>Código:</strong> {perfil?.usuario.username}
            </p>
            <p className="text-gray-600 mt-1">
              <strong>Carnet:</strong> {perfil?.info.carnet}
            </p>

            {/* Mostrar especialidad solo si existe */}
            {perfil?.info && hasEspecialidad(perfil.info) && (
              <>
                <p className="text-gray-600 mt-1">
                  <strong>Especialidad:</strong> {perfil.info.especialidad.nombre}
                </p>
                <p className="text-gray-600 mt-1">
                  <strong>Duración:</strong> {perfil.info.especialidad.duracion} semestres
                </p>
              </>
            )}

            <p className="text-gray-600 mt-1">
              <strong>Estado:</strong>{" "}
              <span
                className={`${
                  perfil?.info.estado.nombre === "ACTIVO"
                    ? "text-green-600"
                    : "text-red-600"
                } font-semibold`}
              >
                {perfil?.info.estado.nombre}
              </span>
            </p>
          </div>
        </div>

        {/* Información del usuario */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Información de Usuario
          </h2>
          <p className="text-gray-600">
            <strong>Username:</strong> {perfil?.usuario.username}
          </p>
          <p className="text-gray-600 mt-1">
            <strong>Email:</strong> {perfil?.usuario.email}
          </p>
          <p className="text-gray-600 mt-1">
            <strong>Rol:</strong> {perfil?.usuario.rol}
          </p>
        </div>

        {/* Botones de acciones */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300"
          >
            Volver atrás
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
            Editar perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
