"use client";
import { useEffect, useState } from "react";
import { fetchPrediction } from "@/services/cuadro-de-mando/prediccion-estado";
import { Bar } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faFilter } from "@fortawesome/free-solid-svg-icons";
import { TableSearch } from "../ui/table/tableSearch";
import { FilterComponent } from "../ui/table/Filters/docentesFilters";
import { Title } from "../ui/title/title";

export default function PredictionChart() {
  const [chartData, setChartData] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );

  const columnsFilter = [
    {
      key: "especialidad.nombre",
      label: "Especialidad",
      entidad: "especialidades",
    },
    {
      key: "estado",
      label: "Estado",
      values: [
        { key: "ACTIVO", label: "ACTIVO" },
        { key: "INACTIVO", label: "INACTIVO" },
      ],
    },
  ];

  // Detectar cambio en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRemoveFilter = (key: string) => {
    const updatedFilters = { ...appliedFilters };
    delete updatedFilters[key];
    setAppliedFilters(updatedFilters);
    setFilters(updatedFilters);
  };

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    setFilters(filters);
    setIsFilterModalOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleLoadData = async () => {
    try {
      const result = await fetchPrediction({ filter: filters });
      const predictions = result.data;

      const groupedByEspecialidad = predictions.reduce(
        (acc: any, curr: any) => {
          const { especialidad, prediccion } = curr;
          acc[especialidad] = acc[especialidad] || {
            Excelencia: 0,
            Activo: 0,
            Recuperación: 0,
            Condicional: 0,
            Alerta: 0,
            Reprobado: 0,
          };
          acc[especialidad][prediccion.estado_academico]++;
          return acc;
        },
        {}
      );

      const labels = Object.keys(groupedByEspecialidad);
      const states = [
        "Excelencia",
        "Activo",
        "Recuperación",
        "Condicional",
        "Alerta",
        "Reprobado",
      ];
      const datasets = states.map((state, index) => ({
        label: state,
        data: labels.map((label) => groupedByEspecialidad[label][state]),
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)", // Excelencia
          "rgba(75, 192, 192, 0.2)", // Activo
          "rgba(255, 159, 64, 0.2)", // Recuperación
          "rgba(153, 102, 255, 0.2)", // Condicional
          "rgba(255, 206, 86, 0.2)", // Alerta
          "rgba(255, 99, 132, 0.2)", // Reprobado
        ][index],
        borderColor: [
          "rgba(54, 162, 235, 1)", // Excelencia
          "rgba(75, 192, 192, 1)", // Activo
          "rgba(255, 159, 64, 1)", // Recuperación
          "rgba(153, 102, 255, 1)", // Condicional
          "rgba(255, 206, 86, 1)", // Alerta
          "rgba(255, 99, 132, 1)", // Reprobado
        ][index],
        borderWidth: 1,
      }));

      setChartData({
        labels,
        datasets,
      });

      const totalByState: { [key: string]: number } = {};
      states.forEach((state) => {
        totalByState[state] = predictions.filter(
          (p: any) => p.prediccion.estado_academico === state
        ).length;
      });

      setSummary(totalByState);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    handleLoadData();
  }, [filters]);

  return (
    <div className="py-6 px-4 bg-white rounded shadow mx-auto max-w-4xl">
      <Title title="Predicción de Estado Académico" />

      {/* Filtros */}
      <div className="flex flex-col md:flex-row items-center justify-between px-2 gap-4">
        <TableSearch value={search} onSearchChange={handleSearchChange} />
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center justify-center bg-royalBlue-darker text-white px-4 py-2 rounded-lg hover:bg-royalBlue-dark transition-all duration-300"
        >
          <FontAwesomeIcon icon={faFilter} className="h-5 w-5 mr-2" />
          Filtrar
        </button>
      </div>

      {Object.keys(appliedFilters).length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Filtros Aplicados:</h2>
          <ul className="flex flex-wrap gap-2 mt-2">
            {Object.entries(appliedFilters).map(([key, value]) => {
              const column = columnsFilter.find(
                (el) => "filter." + el.key === key
              );
              return (
                <li
                  key={key}
                  className="bg-royalBlue-darker text-white px-3 py-1 rounded-full flex items-center"
                >
                  {column?.label}: {value}
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    onClick={() => handleRemoveFilter(key)}
                    className="ml-2 cursor-pointer"
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {chartData && (
        <div className="mt-6">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: windowWidth > 768, // Mantener proporción sólo en pantallas grandes
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Distribución por Especialidad",
                  font: { size: windowWidth > 768 ? 18 : 14 }, // Tamaño de fuente adaptativo
                },
              },
              scales: {
                x: {
                  ticks: { maxRotation: 0, minRotation: 0 },
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      )}

      {isFilterModalOpen && (
        <FilterComponent
          columns={columnsFilter}
          onApplyFilters={handleApplyFilters}
          onClose={() => setIsFilterModalOpen(false)}
          initialFilters={appliedFilters}
        />
      )}
    </div>
  );
}
