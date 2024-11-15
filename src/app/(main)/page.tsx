"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Chart as ChartJS,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import Swal from "sweetalert2";
import LoadingScreen from "@/components/ui/loading-page/page";
import UnauthorizedScreen from "@/components/ui/unautorized/page";

// Registrar las escalas y elementos en ChartJS
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

// Definición de interfaces para TypeScript estricto
interface Clase {
  id_clase: number;
  nombre: string;
}

interface Asistencia {
  fecha: string;
  asistio: boolean;
}

interface Rendimiento {
  estudiante: string;
  nota_final: number;
}

interface Crecimiento {
  año: string;
  total: number;
}

interface CargaAcademica {
  clase: string;
  horas_semana: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}

export default function CuadroDeMando() {
  const { data: session, status } = useSession();
  const [clases, setClases] = useState<Clase[]>([]);
  const [asistenciaData, setAsistenciaData] = useState<ChartData>({ labels: [], datasets: [] });
  const [rendimientoData, setRendimientoData] = useState<ChartData>({ labels: [], datasets: [] });
  const [crecimientoData, setCrecimientoData] = useState<ChartData>({ labels: [], datasets: [] });
  const [cargaAcademicaData, setCargaAcademicaData] = useState<ChartData>({ labels: [], datasets: [] });

  useEffect(() => {
    if (session) {
      cargarDatos();
    }
  }, [session]);

  const cargarDatos = () => {
    // Datos estáticos de ejemplo
    const clasesEjemplo: Clase[] = [
      { id_clase: 1, nombre: "Matemáticas" },
      { id_clase: 2, nombre: "Ciencias" },
    ];

    const asistenciasEjemplo: Asistencia[] = [
      { fecha: "2024-10-01", asistio: true },
      { fecha: "2024-10-02", asistio: false },
      { fecha: "2024-10-03", asistio: true },
    ];

    const rendimientoEjemplo: Rendimiento[] = [
      { estudiante: "Juan Pérez", nota_final: 85 },
      { estudiante: "Ana Gómez", nota_final: 90 },
      { estudiante: "Luis Rodríguez", nota_final: 78 },
    ];

    const crecimientoEjemplo: Crecimiento[] = [
      { año: "2022", total: 200 },
      { año: "2023", total: 250 },
      { año: "2024", total: 300 },
    ];

    const cargaAcademicaEjemplo: CargaAcademica[] = [
      { clase: "Matemáticas", horas_semana: 5 },
      { clase: "Ciencias", horas_semana: 3 },
    ];

    setClases(clasesEjemplo);
    procesarDatosAsistencia(asistenciasEjemplo);
    procesarDatosRendimiento(rendimientoEjemplo);
    procesarDatosCrecimiento(crecimientoEjemplo);
    procesarDatosCargaAcademica(cargaAcademicaEjemplo);
  };

  const procesarDatosAsistencia = (data: Asistencia[]) => {
    const fechas = data.map((item) => item.fecha);
    const asistencias = data.map((item) => (item.asistio ? 1 : 0));

    setAsistenciaData({
      labels: fechas,
      datasets: [
        {
          label: "Asistencia de Estudiantes",
          data: asistencias,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
        },
      ],
    });
  };

  const procesarDatosRendimiento = (data: Rendimiento[]) => {
    const estudiantes = data.map((item) => item.estudiante);
    const notas = data.map((item) => item.nota_final);

    setRendimientoData({
      labels: estudiantes,
      datasets: [
        {
          label: "Rendimiento Académico",
          data: notas,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
        },
      ],
    });
  };

  const procesarDatosCrecimiento = (data: Crecimiento[]) => {
    const años = data.map((item) => item.año);
    const totalEstudiantes = data.map((item) => item.total);

    setCrecimientoData({
      labels: años,
      datasets: [
        {
          label: "Crecimiento de Estudiantes",
          data: totalEstudiantes,
          backgroundColor: "rgba(255, 159, 64, 0.6)",
          borderColor: "rgba(255, 159, 64, 1)",
        },
      ],
    });
  };

  const procesarDatosCargaAcademica = (data: CargaAcademica[]) => {
    const clases = data.map((item) => item.clase);
    const cargaHoraria = data.map((item) => item.horas_semana);

    setCargaAcademicaData({
      labels: clases,
      datasets: [
        {
          label: "Carga Académica por Clase",
          data: cargaHoraria,
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
        },
      ],
    });
  };

  if (status === "loading") return <LoadingScreen />;
  if (status === "unauthenticated" || session?.user.rol !== "ADMIN")
    return <UnauthorizedScreen />;

  return (
    <div className="p-8 h-full bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Cuadro de Mando Académico</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {/* Asistencia */}
        <div className="bg-white p-4 rounded shadow-md flex flex-col items-center justify-center h-[45vh]">
          <h2 className="text-lg font-semibold mb-2">Asistencia de Estudiantes</h2>
          <Line data={asistenciaData} options={{ maintainAspectRatio: false }} />
        </div>

        {/* Rendimiento Académico */}
        <div className="bg-white p-4 rounded shadow-md flex flex-col items-center justify-center h-[45vh]">
          <h2 className="text-lg font-semibold mb-2">Rendimiento Académico</h2>
          <Bar data={rendimientoData} options={{ maintainAspectRatio: false }} />
        </div>

        {/* Crecimiento de Estudiantes */}
        <div className="bg-white p-4 rounded shadow-md flex flex-col items-center justify-center h-[45vh]">
          <h2 className="text-lg font-semibold mb-2">Crecimiento de Estudiantes</h2>
          <Pie data={crecimientoData} options={{ maintainAspectRatio: false }} />
        </div>

        {/* Carga Académica */}
        <div className="bg-white p-4 rounded shadow-md flex flex-col items-center justify-center h-[45vh]">
          <h2 className="text-lg font-semibold mb-2">Carga Académica</h2>
          <Doughnut data={cargaAcademicaData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}
