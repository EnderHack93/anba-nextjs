"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchEntidades, editarEntidad } from "@/services/common/apiService";
import Swal from "sweetalert2";
import { Clase } from "@/interfaces/entidades/clase";
import { Asistencia } from "@/interfaces/entidades/asistencia";
import {
  CreateAsistenciasByClase,
  getAsistenciasByClaseAndDate,
} from "@/services/asistencias/asistencias";
import LoadingScreen from "@/components/ui/loading-page/page";
import UnauthorizedScreen from "@/components/ui/unautorized/page";
import { fetchClasesByDocente } from "@/services/docentes-endpoints/clases";
import { Title } from "@/components";
import { format, isValid } from "date-fns";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

export default function GestionAsistencias() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [selectedClase, setSelectedClase] = useState<string>("");
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    new Date().toISOString().split("T")[0]
  ); // Fecha actual
  const { data: session, status } = useSession();

  const fetchClases = async () => {
    try {
      const response = await fetchClasesByDocente(session?.user.accessToken);
      setClases(response);
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
      if (!selectedClase || !selectedDate) return;
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

  const isDateValid = (): boolean => {
    return (
      selectedDate !== null && isValid(new Date(`${selectedDate}T00:00:00`))
    );
  };

  const adjustDate = (days: number) => {
    if (!isDateValid()) return;
    const newDate = new Date(`${selectedDate}T00:00:00`);
    newDate.setDate(newDate.getDate() + days);
    const formattedDate = format(newDate, "yyyy-MM-dd");
    setSelectedDate(formattedDate);
  };

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
            selectedDate,
            session?.user.accessToken
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
  const handleCambiarEstado = async (
    id_asistencia: string,
    nuevoEstado: string
  ) => {
    try {
      await editarEntidad({
        entidad: "asistencias",
        id: id_asistencia,
        data: { nuevoEstado },
        token: session?.user.accessToken,
      });

      setAsistencias((prevAsistencias) =>
        prevAsistencias.map((asistencia) =>
          asistencia.id_asistencia === Number(id_asistencia)
            ? { ...asistencia, asistio: nuevoEstado }
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

  useEffect(() => {
    if (status === "authenticated") {
      fetchClases();
    }
  }, [status, session]);

  useEffect(() => {
    if (selectedClase && isDateValid()) {
      fetchAsistencias();
    }
  }, [selectedClase, selectedDate]);

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (status === "unauthenticated" || session?.user.rol !== "DOCENTE") {
    return <UnauthorizedScreen />;
  }

  return (
    <div className="flex-wrap justify-center items-center">
      <div className="bg-white w-11/12 md:w-1/2 justify-self-center p-4 rounded-md mt-6 shadow-md">
        <Title title="Panel de Asistencia" />
        <div className="w-full rounded h-px bg-gray-300 my-6" />

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
            onChange={(e) => setSelectedClase(e.target.value)}
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
        {selectedClase && (
          <div className="mb-4 flex items-end space-x-4">
            <button
              onClick={() => adjustDate(-1)}
              className={`bg-blue-500 flex items-center  text-white px-4 py-2 rounded hover:bg-blue-600 ${
                !isDateValid() && "opacity-50 cursor-not-allowed"
              }`}
              disabled={!isDateValid()}
            >
              <IoArrowBack className="sm:mr-1" size={20} />
              <span className="hidden sm:block">Anterior</span>
            </button>
            <div className="flex-1">
              <input
                type="date"
                id="fecha"
                value={selectedDate || ""}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
              />
            </div>
            <button
              onClick={() => adjustDate(1)}
              className={`bg-blue-500 flex items-center text-white px-4 py-2 rounded hover:bg-blue-600 ${
                !isDateValid() && "opacity-50 cursor-not-allowed"
              }`}
              disabled={!isDateValid()}
            >
              <span className="hidden sm:block">Siguiente</span>
              <IoArrowForward className="sm:ml-1" size={20} />
            </button>
          </div>
        )}

        {/* Botón para iniciar registro */}
        {selectedClase && asistencias.length === 0 && (
          <button
            onClick={iniciarRegistroAsistencia}
            className={`bg-emeraldGreen text-white py-2 px-4 rounded-md hover:bg-emeraldGreen-dark transition duration-200 ${
              !isDateValid() && "opacity-50 cursor-not-allowed"
            }`}
            disabled={!isDateValid()}
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
                        className={`px-2 py-1 border-gray-300 rounded-md focus:outline-none border-2 ${asistencia.asistio === "FALTÓ" ? " border-red-600 " : asistencia.asistio === "LICENCIA" ? "border-yellow-500" : "border-emeraldGreen"} `}
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
    </div>
  );
}
