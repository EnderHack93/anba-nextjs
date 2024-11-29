"use client";
import { useEffect, useState } from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import PredictionWidget from "@/components/prediction/page";
import LoadingScreen from "@/components/ui/loading-page/page";
import UnauthorizedScreen from "@/components/ui/unautorized/page";
import { useSession } from "next-auth/react";
import {
  fetchAsistenciaData,
  fetchCrecimientoEstudiantes,
  fetchRendimientoData,
} from "@/services/cuadro-de-mando/prediccion-estado";
import InicioDocente from "@/components/ui/docente/page";

// Registrar elementos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export default function CuadroDeMando() {
  const [dimensionSeleccionada, setDimensionSeleccionada] = useState("estadoAcademico");
  const [widgetKey, setWidgetKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [crecimientoData, setCrecimientoData] = useState<any>(null);
  const [asistenciaData, setAsistenciaData] = useState<any>(null);
  const [asistenciaPorClase, setAsistenciaPorClase] = useState<any>(null);
  const [asistenciaPorSemestre, setAsistenciaPorSemestre] = useState<any>(null);
  const [rendimientoPorEstudiante, setRendimientoPorEstudiante] = useState<any>(null);
  const [rendimientoPorEspecialidad, setRendimientoPorEspecialidad] = useState<any>(null);
  const [rendimientoPorSemestre, setRendimientoPorSemestre] = useState<any>(null);
  const [rendimientoPorDocente, setRendimientoPorDocente] = useState<any>(null);
  const { data: session, status } = useSession();

  // Cambiar dimensión seleccionada
  const handleDimensionChange = (dimension: string) => {
    setDimensionSeleccionada(dimension);
  };

  // Cargar datos desde el backend
  useEffect(() => {
    const loadData = async () => {
      if (status !== "authenticated") return;

      setIsLoading(true);
      try {
        const [crecimiento, asistencia, rendimiento] = await Promise.all([
          fetchCrecimientoEstudiantes(session.user.accessToken),
          fetchAsistenciaData(session.user.accessToken),
          fetchRendimientoData(session.user.accessToken),
        ]);

        // Asistencia
        setCrecimientoData(crecimiento);
        setAsistenciaData(asistencia.asistencia);
        setAsistenciaPorClase(asistencia.asistencia2);
        setAsistenciaPorSemestre(asistencia.asistencia3);

        // Rendimiento
        setRendimientoPorEstudiante(rendimiento.promedioPorEstudiante);
        setRendimientoPorSemestre(rendimiento.promedioPorSemestre);
        setRendimientoPorDocente(rendimiento.promedioPorDocente);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [session, status]);

    // Formatear etiquetas para quitar la hora
    const formatLabels = (labels: string[]) => {
      return labels.map((label) => new Date(label).toLocaleDateString());
    };

  if (status === "loading" || isLoading) return <LoadingScreen />;
  if (status === "unauthenticated" ) return <UnauthorizedScreen />;
  if(session?.user.rol === "DOCENTE") return <InicioDocente/>

  return (
    <div className="flex flex-col items-center mt-4 p-4 bg-gray-100 max-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Cuadro de Mando Académico</h1>

      {/* Contenedor principal */}
      <div className="flex flex-wrap xl:flex-nowrap gap-6 w-full">
        {/* Predicciones */}
        <div className="flex-[4] bg-white rounded-lg shadow-md">
          <PredictionWidget key={widgetKey} />
        </div>

        {/* Gráficos */}
        <div className="flex-[6] flex flex-col gap-4">
          <div className="flex justify-center gap-4 mb-4">
            {[
              { key: "asistencia", label: "Asistencia" },
              { key: "estadoAcademico", label: "Estado Académico" },
              { key: "rendimiento", label: "Rendimiento" },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  dimensionSeleccionada === key
                    ? "bg-royalBlue-darker text-white shadow-md"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handleDimensionChange(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Renderizar gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Estado Académico */}
            {dimensionSeleccionada === "estadoAcademico" && crecimientoData && (
              <div className="bg-white p-6 max-h-[650px] rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Crecimiento de Estudiantes</h2>
                <Pie
                  data={{
                    labels: crecimientoData.labels,
                    datasets: [
                      {
                        label: "Crecimiento de Estudiantes",
                        data: crecimientoData.data,
                        backgroundColor: [
                          "rgba(75, 192, 192, 0.6)",
                          "rgba(54, 162, 235, 0.6)",
                          "rgba(255, 99, 132, 0.6)",
                        ],
                      },
                    ],
                  }}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            )}

            {/* Asistencia */}
            {dimensionSeleccionada === "asistencia" && asistenciaData && (
              <>
                <div className="bg-white p-6 rounded-lg max-h-[650px] shadow-md">
                  <h2 className="text-lg font-semibold mb-4">Asistencia por Fecha</h2>
                  <Line
                  className="py-6"
                    data={{
                      labels: formatLabels(asistenciaData.labels),
                      datasets: [
                        {
                          label: "Asistencia",
                          data: asistenciaData.data,
                          backgroundColor: "rgba(54, 162, 235, 0.6)",
                          borderColor: "rgba(54, 162, 235, 1)",
                        },
                      ],
                    }}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
                <div className="bg-white p-6 rounded-lg max-h-[650px] shadow-md">
                  <h2 className="text-lg font-semibold mb-4">Promedio por Clase</h2>
                  <Doughnut
                    data={{
                      labels: asistenciaPorClase.labels,
                      datasets: [
                        {
                          label: "Promedio por Clase",
                          data: asistenciaPorClase.data,
                          backgroundColor: [
                            "rgba(255, 159, 64, 0.6)",
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                          ],
                        },
                      ],
                    }}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
                <div className="bg-white p-6 rounded-lg max-h-[650px] shadow-md">
                  <h2 className="text-lg font-semibold mb-4">Promedio por Semestre</h2>
                  <Bar
                  className="py-6"
                    data={{
                      labels: asistenciaPorSemestre.labels,
                      datasets: [
                        {
                          label: "Promedio por Semestre",
                          data: asistenciaPorSemestre.data,
                          backgroundColor: "rgba(75, 192, 192, 0.6)",
                        },
                      ],
                    }}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </>
            )}

            {/* Rendimiento */}
            {dimensionSeleccionada === "rendimiento" && rendimientoPorEstudiante && (
              <>
                <div className="bg-white p-6 rounded-lg max-h-[650px] shadow-md">
                  <h2 className="text-lg font-semibold mb-4">Rendimiento por Estudiante</h2>
                  <Bar
                  className="py-6"
                    data={{
                      labels: rendimientoPorEstudiante.labels,
                      datasets: [
                        {
                          label: "Promedio de Notas",
                          data: rendimientoPorEstudiante.data,
                          backgroundColor: "rgba(75, 192, 192, 0.6)",
                        },
                      ],
                    }}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
                <div className="bg-white p-6 rounded-lg max-h-[650px] shadow-md">
                  <h2 className="text-lg font-semibold mb-4">Rendimiento por Semestre</h2>
                  <Bar
                  className="py-6"
                    data={{
                      labels: rendimientoPorSemestre.labels,
                      datasets: [
                        {
                          label: "Promedio de Notas",
                          data: rendimientoPorSemestre.data,
                          backgroundColor: "rgba(54, 162, 235, 0.6)",
                        },
                      ],
                    }}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
                <div className="bg-white p-6 rounded-lg max-h-[650px] shadow-md">
                  <h2 className="text-lg font-semibold mb-4">Rendimiento por Docente</h2>
                  <Line
                  className="py-6"
                    data={{
                      labels: rendimientoPorDocente.labels,
                      datasets: [
                        {
                          label: "Promedio de Notas",
                          data: rendimientoPorDocente.data,
                          borderColor: "rgba(255, 99, 132, 1)",
                          backgroundColor: "rgba(255, 99, 132, 0.2)",
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: "Docentes",
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: "Promedio de Notas",
                          },
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
