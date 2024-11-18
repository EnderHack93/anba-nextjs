"use client";
import { useSession } from "next-auth/react";
import UnauthorizedScreen from "@/components/ui/unautorized/page";
import LoadingScreen from "@/components/ui/loading-page/page";
import { useEffect, useState } from "react";
import { fetchProfileInfo } from "@/services/user/profile";
import { ProfileUser } from "@/interfaces/entidades/profile-docente";
import { useRouter } from "next/navigation";

const PerfilDocente = () => {
  const { data: session, status } = useSession();
  const [perfil, setPerfil] = useState<ProfileUser | null>(null);
  const router = useRouter();

  const fetchInfo = async () => {
    if (session?.user.accessToken) {
      const response = await fetchProfileInfo(session?.user.accessToken);
      if (response) {
        setPerfil(response);
      }
    }
  };

  // Fetch del perfil del docente
  useEffect(() => {
    if (status === "authenticated") {
      fetchInfo();
    }
  }, [status]);

  // Mostrar pantalla de carga mientras se carga la sesión
  if (status === "loading") {
    return <LoadingScreen />;
  }

  // Mostrar pantalla de no autorizado si no tiene acceso
  if (
    status === "unauthenticated" ||
    (session?.user?.rol !== "ADMIN" &&
      session?.user?.rol !== "DOCENTE" &&
      session?.user?.rol !== "ESTUDIANTE")
  ) {
    return <UnauthorizedScreen />;
  }

  // Manejar la acción de regresar
  const handleGoBack = () => {
    router.back();
  };

  // Manejar la acción de editar el perfil
  const handleEditProfile = () => {
    router.push(`/docente/editar/${perfil?.id_docente}`);
  };

  return (
    // <div className="flex items-center justify-center h-full bg-gray-100">
    //   <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
    //     {/* Información del docente */}
    //     <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
    //       {/* Imagen de perfil */}
    //       <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
    //         <img
    //           src={docente?.img_perfil}
    //           alt={`${docente?.nombres} ${docente?.apellidos}`}
    //           className="w-full h-full object-cover"
    //         />
    //       </div>

    //       {/* Detalles del docente */}
    //       <div className="flex-1">
    //         <h1 className="text-3xl font-bold text-gray-800">
    //           {docente?.nombres} {docente?.apellidos}
    //         </h1>
    //         <p className="text-gray-600 mt-1">
    //           <strong>Código:</strong> {docente?.id_docente}
    //         </p>
    //         <p className="text-gray-600 mt-1">
    //           <strong>Carnet:</strong> {docente?.carnet}
    //         </p>
    //         <p className="text-gray-600 mt-1">
    //           <strong>Especialidad:</strong> {docente?.especialidad.nombre}
    //         </p>
    //         <p className="text-gray-600 mt-1">
    //           <strong>Duración de la especialidad:</strong>{" "}
    //           {docente?.especialidad.duracion} semestres
    //         </p>
    //         <p className="text-gray-600 mt-1">
    //           <strong>Estado:</strong>{" "}
    //           <span
    //             className={`${
    //               docente?.estado === "ACTIVO"
    //                 ? "text-green-600"
    //                 : "text-red-600"
    //             } font-semibold`}
    //           >
    //             {docente?.estado}
    //           </span>
    //         </p>
    //       </div>
    //     </div>

    //     {/* Información de usuario */}
    //     <div className="mt-8 border-t pt-6">
    //       <h2 className="text-2xl font-bold text-gray-800 mb-4">
    //         Información de Usuario
    //       </h2>
    //       <p className="text-gray-600">
    //         <strong>Username:</strong> {docente?.usuario.username}
    //       </p>
    //       <p className="text-gray-600 mt-1">
    //         <strong>Email:</strong> {docente?.usuario.email}
    //       </p>
    //       <p className="text-gray-600 mt-1">
    //         <strong>Rol:</strong> {docente?.usuario.rol}
    //       </p>
    //     </div>

    //     {/* Botones de acciones */}
    //     <div className="flex justify-between mt-8">
    //       <button
    //         onClick={handleGoBack}
    //         className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300"
    //       >
    //         Volver atrás
    //       </button>
    //       <button
    //         onClick={handleEditProfile}
    //         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
    //       >
    //         Editar perfil
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className=""></div>
  );
};

export default PerfilDocente;
