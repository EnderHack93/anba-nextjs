"use client";
import { useState } from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement, // ¡Importante para gráficos Pie y Doughnut!
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Registrar los elementos necesarios para los gráficos
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement, // Registro de ArcElement
  Tooltip,
  Legend,
  Title
);

export default function CuadroDeMando() {
  const [dimensionSeleccionada, setDimensionSeleccionada] =
    useState("estadoAcademico");

  // Datos de ejemplo
  const asistenciaData = {
    labels: ["2024-10-01", "2024-10-02", "2024-10-03"],
    datasets: [
      {
        label: "Asistencia",
        data: [1, 0, 1],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const rendimientoData = {
    labels: ["Juan", "Ana", "Luis"],
    datasets: [
      {
        label: "Rendimiento",
        data: [85, 90, 78],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const crecimientoData = {
    labels: ["2022", "2023", "2024"],
    datasets: [
      {
        label: "Crecimiento de Estudiantes",
        data: [200, 250, 300],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
      },
    ],
  };

  // Cambiar la dimensión seleccionada
  const handleDimensionChange = (dimension: string) => {
    setDimensionSeleccionada(dimension);
  };

  return (
    <div className="h-full flex flex-col p-4 bg-gray-100 overflow-hidden">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Cuadro de Mando Académico
      </h1>

      {/* Selector de dimensiones */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 sm:px-6 py-2 rounded-lg sm:font-medium text-sm sm:text-lg transition-all ${
            dimensionSeleccionada === "asistencia"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => handleDimensionChange("asistencia")}
        >
          Asistencia
        </button>
        <button
          className={`px-4 sm:px-6 py-2 rounded-lg sm:font-medium text-sm sm:text-lg transition-all ${
            dimensionSeleccionada === "estadoAcademico"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => handleDimensionChange("estadoAcademico")}
        >
          Estado Académico
        </button>
        <button
          className={`px-4 sm:px-6 py-2 rounded-lg sm:font-medium text-sm sm:text-lg transition-all ${
            dimensionSeleccionada === "rendimiento"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => handleDimensionChange("rendimiento")}
        >
          Rendimiento
        </button>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {dimensionSeleccionada === "estadoAcademico" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-[35vh]">
              <h2 className="text-lg font-semibold mb-4">
                Crecimiento de Estudiantes
              </h2>
              <Pie
                data={crecimientoData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-[35vh]">
              <h2 className="text-lg font-semibold mb-4">
                Distribución por Ciclos
              </h2>
              <Doughnut
                data={crecimientoData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-[35vh]">
              <h2 className="text-lg font-semibold mb-4">
                Proyección de Inscripciones
              </h2>
              <Line
                data={crecimientoData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </>
        )}

        {dimensionSeleccionada === "asistencia" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-[35vh]">
              <h2 className="text-lg font-semibold mb-4">
                Asistencia por Fecha
              </h2>
              <Line
                data={asistenciaData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-[35vh]">
              <h2 className="text-lg font-semibold mb-4">Asistencia Mensual</h2>
              <Bar
                data={asistenciaData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-[35vh]">
              <h2 className="text-lg font-semibold mb-4">
                Promedio de Asistencia
              </h2>
              <Pie
                data={asistenciaData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </>
        )}

        {dimensionSeleccionada === "rendimiento" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-[35vh]">
              <h2 className="text-lg font-semibold mb-4">
                Rendimiento Académico
              </h2>
              <Bar
                data={rendimientoData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-[35vh]">
              <h2 className="text-lg font-semibold mb-4">
                Distribución de Notas
              </h2>
              <Doughnut
                data={rendimientoData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-[35vh]">
              <h2 className="text-lg font-semibold mb-4">Promedio General</h2>
              <Line
                data={rendimientoData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
