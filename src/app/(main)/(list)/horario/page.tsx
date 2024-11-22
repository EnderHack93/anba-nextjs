"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import LoadingScreen from "@/components/ui/loading-page/page";
import UnauthorizedScreen from "@/components/ui/unautorized/page";
import { Title } from "@/components";
import { Clase } from "@/interfaces/entidades/clase";
import { fetchClasesByDocente } from "@/services/docentes-endpoints/clases";

// Días de la semana
const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Horarios definidos
const horarios = [
  "7:30 - 9:10",
  "9:20 - 11:00",
  "11:10 - 12:50",
  "13:00 - 14:40",
  "14:50 - 16:30",
  "16:40 - 18:20",
  "18:30 - 20:10",
  "20:20 - 22:00",
];

export default function HorarioPage() {
  const { data: session, status } = useSession();
  const [clases, setClases] = useState<Clase[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState("Lunes"); // Día seleccionado para móviles

  const fetchClases = async () => {
    try {
      const response = await fetchClasesByDocente(session?.user.accessToken);
      setClases(response);
    } catch (err) {
      console.error(err);
    }
  };

  // Función para obtener las clases por día y hora
  const obtenerClasesPorHorario = (dia: string, horario: string) => {
    const [horaInicio, horaFin] = horario.split(" - ");
    return clases.filter(
      (clase) =>
        clase.dias.includes(dia) &&
        clase.horaInicio === horaInicio &&
        clase.horaFin === horaFin
    );
  };

  useEffect(() => {
    if (status === "authenticated") fetchClases();
  }, [status]);

  if (status === "loading") return <LoadingScreen />;
  if (status === "unauthenticated") return <UnauthorizedScreen />;

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center">
      <div className="w-full bg-white p-6 rounded-lg shadow-md">
        <Title title="Horario de Clases" />
        <div className="w-full rounded h-px bg-gray-300 my-6" />

        {/* Vista para dispositivos móviles */}
        <div className="md:hidden">
          <div className="flex flex-wrap justify-center overflow-x-auto mb-6 space-x-2 no-scrollbar">
            {dias.map((dia) => (
              <button
                key={dia}
                className={`px-4 py-2 rounded-md font-medium flex-shrink-0 ${
                  dia === diaSeleccionado
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                }`}
                onClick={() => setDiaSeleccionado(dia)}
              >
                {dia}
              </button>
            ))}
          </div>

          {/* Horario para el día seleccionado */}
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border p-3 text-center">Hora</th>
                  <th className="border p-3 text-center">Clases</th>
                </tr>
              </thead>
              <tbody>
                {horarios.map((horario) => {
                  const clasesPorHorario = obtenerClasesPorHorario(
                    diaSeleccionado,
                    horario
                  );
                  return (
                    <tr key={horario} className="even:bg-gray-100">
                      <td className="border p-3 font-semibold text-center">
                        {horario}
                      </td>
                      <td className="border p-3 text-center">
                        {clasesPorHorario.length > 0 ? (
                          clasesPorHorario.map((clase) => (
                            <div
                              key={clase.id_clase}
                              className="bg-blue-200 text-blue-800 text-sm rounded-md p-2 mb-2 shadow-sm"
                            >
                              <strong>{clase.nombre}</strong>
                              <br />
                              Aula: {clase.aula}
                              <br />
                              Materia: {clase.materia.nombre}
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-sm">
                            Sin clase
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vista para computadoras */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border p-3 text-center">Hora / Día</th>
                {dias.map((dia) => (
                  <th key={dia} className="border p-3 text-center">
                    {dia}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horarios.map((horario) => (
                <tr key={horario} className="even:bg-gray-100">
                  <td className="border p-3 font-semibold text-center">
                    {horario}
                  </td>
                  {dias.map((dia) => {
                    const clasesPorHorario = obtenerClasesPorHorario(
                      dia,
                      horario
                    );
                    return (
                      <td key={dia} className="border p-3 text-center">
                        {clasesPorHorario.length > 0 ? (
                          clasesPorHorario.map((clase) => (
                            <div
                              key={clase.id_clase}
                              className="bg-blue-200 text-blue-800 text-sm rounded-md p-2 mb-2 shadow-sm"
                            >
                              <strong>{clase.nombre}</strong>
                              <br />
                              Aula: {clase.aula}
                              <br />
                              Materia: {clase.materia.nombre}
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-sm">
                            Sin clase
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
