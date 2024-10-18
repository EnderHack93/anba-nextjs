"use client";
import { TableSearch, Title } from "@/components";
import { Especialidad } from "@/interfaces/entidades/especialidad";
import { desactivarEntidad, fetchEntidades } from "@/services/common/apiService";
import { faCircleXmark, faFilter, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCheckmarkCircleOutline, IoOptionsOutline, IoRemoveCircleOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { FilterComponent } from "@/components/ui/table/Filters/docentesFilters";

const columnsFilter = [
  {
    key: "estado.nombre",
    label: "Estado",
    values: [
      { key: "ACTIVO", label: "ACTIVO" },
      { key: "INACTIVO", label: "INACTIVO" },
    ],
  },
];

export default function ListaEspecialidades() {
  const [data, setData] = useState<Especialidad[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});

  const handleCambiarEstado = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Cambiarás el estado de la especialidad",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4169E1",
        cancelButtonColor: "#FF4040",
        confirmButtonText: "Sí, cambiar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await desactivarEntidad({ entidad: "especialidades", id });
        Swal.fire({
          icon: "success",
          title: "Cambiado",
          text: "Estado de la especialidad actualizado",
          showConfirmButton: false,
          timer: 1000,
        });
        fetchEspecialidades();
      }
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      Swal.fire("Error", "No se pudo cambiar el estado de la especialidad", "error");
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

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

  const fetchEspecialidades = async () => {
    try {
      const response = await fetchEntidades({
        entidad: "especialidades",
        search,
        page: currentPage,
        limit: pageSize,
        filter: filters,
      });
      setTotalPages(response.meta.totalPages);
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener las especialidades:", error);
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, [search, currentPage, pageSize, filters]);

  const renderCard = (item: Especialidad) => (
    <div key={item.id_especialidad} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-start justify-between">
      <div className="flex-col mb-4">
        <h3 className="text-lg font-bold text-gray-700">{item.nombre}</h3>
        <p className="text-sm text-gray-500">Duración: {item.duracion} semestres</p>
        <p className="text-sm text-gray-500">Estado: {item.estado.nombre}</p>
      </div>
      <div className="flex gap-4">
        <Link href={`/especialidades/editar/${item.id_especialidad}`}>
          <button className="bg-royalBlue text-white px-4 py-2 rounded-lg flex items-center">
            <IoOptionsOutline className="mr-2" />
            <span>Editar</span>
          </button>
        </Link>
        <button
          onClick={() => handleCambiarEstado(item.id_especialidad.toString())}
          className={`px-4 py-2 rounded-lg flex items-center ${item.estado.nombre === "ACTIVO" ? "bg-coralRed" : "bg-green-600"} text-white`}
        >
          {item.estado.nombre === "ACTIVO" ? (
            <>
              <IoRemoveCircleOutline className="mr-2" />
              <span>Desactivar</span>
            </>
          ) : (
            <>
              <IoCheckmarkCircleOutline className="mr-2" />
              <span>Activar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full overflow-auto">
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-6">
        <Title title="Especialidades" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="hidden md:block text-xl font-semibold">Todas las especialidades</h1>
          </div>
          <div className="flex-col md:flex w-full justify-center gap-4 md:w-auto">
            <TableSearch value={search} onSearchChange={handleSearchChange} />
            <div className="flex justify-center items-center md:justify-end  mt-4 md:mt-0 w-full  gap-4 self-end">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center justify-center bg-royalBlue-darker text-white p-2  sm:px-2 sm:py-1 rounded-lg"
              >
                <FontAwesomeIcon
                  icon={faFilter}
                  className="h-5 m-0 px-2 sm:px-0 sm:me-1"
                />
                <div className="hidden sm:block text-lg">Filtrar</div>
              </button>
              <a
                className="flex items-center justify-center bg-emeraldGreen-darker text-white p-2  sm:px-2 sm:py-1 rounded-lg "
                href={"/especialidades/crear"}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className=" h-5 m-0 px-2 sm:px-0 sm:me-1"
                />
                <div className="hidden sm:block text-lg">Crear nuevo</div>
              </a>
            </div>
          </div>
        </div>
        {Object.keys(appliedFilters).length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Filtros Aplicados:</h2>
            <ul className="flex flex-wrap gap-2 mt-2">
              {Object.entries(appliedFilters).map(([key, value]) => {
                const column = columnsFilter.find((el) => el.key === key);
                return (
                  <li key={key} className="bg-royalBlue text-white px-3 py-1 rounded-full flex items-center">
                    {column ? column.label : key}: {value}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {data.length === 0 ? (
            <div className="col-span-full text-center">No hay datos disponibles</div>
          ) : (
            data.map((item) => renderCard(item))
          )}
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-center">
            <label htmlFor="pageSize" className="mr-2 text-sm text-gray-700">Items por página:</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="p-2 border border-gray-300 bg-white rounded-md"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          {isFilterModalOpen && (
            <FilterComponent
              columns={columnsFilter}
              onApplyFilters={handleApplyFilters}
              onClose={() => setIsFilterModalOpen(false)}
              initialFilters={appliedFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
