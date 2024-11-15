"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  fetchEntidades,
  crearEntidad,
  editarEntidad,
} from "@/services/common/apiService";
import Swal from "sweetalert2";
import { Clase } from "@/interfaces/entidades/clase";
import { Asistencia } from "@/interfaces/entidades/asistencia";
import {
  CreateAsistenciasByClase,
  getAsistenciasByClaseAndDate
} from "@/services/asistencias/asistencias";
import LoadingScreen from "@/components/ui/loading-page/page";
import UnauthorizedScreen from "@/components/ui/unautorized/page";

export default function GestionAsistencias() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [selectedClase, setSelectedClase] = useState<string>("");
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]); // Fecha actual
  const { data: session, status } = useSession();

  // Obtener lista de clases al cargar la página
  const fetchClases = async () => {
    try {
      const response = await fetchEntidades({
        entidad: "clases",
        token: session?.user.accessToken,
      });
      setClases(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las clases.",
        confirmButtonText: "Entendido",
      });
    }
  };

  const fetchAsistencias = async () => {
    try {
      const response = await getAsistenciasByClaseAndDate(
        Number(selectedClase),
        selectedDate,
        session?.user.accessToken
      );
      setAsistencias(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las asistencias.",
        confirmButtonText: "Entendido",
      });
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchClases();
    }
  }, [session]);

  useEffect(() => {
    if (selectedClase && selectedDate) {
      fetchAsistencias();
    }
  }, [selectedClase, selectedDate]);

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (status === "unauthenticated" || session?.user.rol !== "DOCENTE") {
    return <UnauthorizedScreen />;
  }

  // Manejar la selección de clase
  const handleClaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClase(e.target.value);
    setAsistencias([]);
  };

  // Manejar la selección de fecha
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setAsistencias([]);
  };

  // Generar registros de asistencia para todos los estudiantes de la clase en la fecha seleccionada
  const iniciarRegistroAsistencia = async () => {
    Swal.fire({
      title: "Iniciar registro de asistencia",
      text: `¿Deseas iniciar un nuevo registro de asistencia para esta clase en la fecha ${selectedDate}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Iniciar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed && selectedClase && selectedDate) {
        try {
          const response = await CreateAsistenciasByClase(
            Number(selectedClase),
            selectedDate, // Pasar la fecha seleccionada
            session?.user.accessToken,
          );

          setAsistencias(response);
          Swal.fire({
            icon: "success",
            title: "Registro iniciado",
            text: "El registro de asistencia ha sido iniciado exitosamente.",
            confirmButtonText: "Entendido",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo iniciar el registro de asistencia.",
            confirmButtonText: "Entendido",
          });
        }
      }
    });
  };

  // Cambiar el estado de asistencia de un estudiante
  const handleCambiarEstado = async (
    id_asistencia: string,
    nuevoEstado: string
  ) => {
    try {
      await editarEntidad({
        entidad: `asistencias`,
        id: id_asistencia,
        data: { nuevoEstado },
        token: session?.user.accessToken,
      });

      setAsistencias((prevAsistencias) =>
        prevAsistencias.map((asistencia) =>
          asistencia.id_asistencia === Number(id_asistencia)
            ? { ...asistencia, asistio:nuevoEstado }
            : asistencia
        )
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el estado de asistencia.",
        confirmButtonText: "Entendido",
      });
    }
  };

  return (
    <div className="bg-white p-4 rounded-md mt-6 shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Gestión de Asistencias
      </h1>

      {/* Selección de clase */}
      <div className="mb-4">
        <label
          htmlFor="clase"
          className="block text-sm font-medium text-gray-700"
        >
          Seleccionar Clase
        </label>
        <select
          id="clase"
          value={selectedClase}
          onChange={handleClaseChange}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
        >
          <option value="">Seleccione una clase</option>
          {clases.map((clase) => (
            <option key={clase.id_clase} value={clase.id_clase}>
              {clase.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Selección de fecha */}
      <div className="mb-4">
        <label
          htmlFor="fecha"
          className="block text-sm font-medium text-gray-700"
        >
          Seleccionar Fecha
        </label>
        <input
          type="date"
          id="fecha"
          value={selectedDate}
          onChange={handleDateChange}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
        />
      </div>

      {/* Botón para iniciar registro */}
      {selectedClase && asistencias.length === 0 && (
        <button
          onClick={iniciarRegistroAsistencia}
          className="bg-emeraldGreen text-white py-2 px-4 rounded-md hover:bg-emeraldGreen-dark transition duration-200"
        >
          Iniciar Registro de Asistencia
        </button>
      )}

      {/* Tabla de asistencias */}
      {asistencias.length > 0 && (
        <div className="overflow-y-auto max-h-80 mt-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-md">
            <thead>
              <tr>
                <th className="text-left px-6 py-3 border-b font-semibold text-gray-700">
                  Estudiante
                </th>
                <th className="text-left px-6 py-3 border-b font-semibold text-gray-700">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {asistencias.map((asistencia) => (
                <tr
                  key={asistencia.id_asistencia}
                  className="hover:bg-gray-100"
                >
                  <td className="px-6 py-4 border-b text-gray-800">
                    {asistencia.estudiante.nombres}{" "}
                    {asistencia.estudiante.apellidos}
                  </td>
                  <td className="px-6 py-4 border-b text-gray-800">
                    <select
                      value={asistencia.asistio}
                      onChange={(e) =>
                        handleCambiarEstado(
                          asistencia.id_asistencia.toString(),
                          e.target.value
                        )
                      }
                      className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emeraldGreen"
                    >
                      <option value="FALTÓ">Falta</option>
                      <option value="ASISTIÓ">Asistió</option>
                      <option value="LICENCIA">Licencia</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
