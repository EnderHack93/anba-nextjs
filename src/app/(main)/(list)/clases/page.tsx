"use client";
import { TablePagination, TableSearch, Title } from "@/components";
import { FilterComponent } from "@/components/ui/table/Filters/docentesFilters";
import { Clase } from "@/interfaces/entidades/clase";
import { desactivarEntidad, fetchEntidades } from "@/services/common/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faFilter,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoOptionsOutline,
  IoPeopleOutline,
  IoRemoveCircleOutline,
} from "react-icons/io5";
import Swal from "sweetalert2";

const columnsFilter = [
  {
    key: "materia.especialidad.nombre",
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

export default function ListaClases() {
  const [data, setData] = useState<Clase[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );

  const handleCambiarEstado = (id: string) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "Estas cambiando el estado de la clase",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4169E1",
      cancelButtonColor: "#FF4040",
      confirmButtonText: "Si, cambiar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        desactivarEntidad({ entidad: "clases", id })
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Cambiado",
              text: "Se ha cambiado el estado de la clase",
              showConfirmButton: false,
              timer: 1000,
            });
            fetchDocentes();
          })
          .catch((err) => {
            console.error("Error al cambiar el estado de la clase:", err);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo cambiar el estado de la clase",
            });
          });
      }
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
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

  const fetchDocentes = async () => {
    try {
      const response = await fetchEntidades({
        entidad: "clases",
        search,
        page: currentPage,
        limit: pageSize,
        filter: filters,
      });
      const data = response.data;
      setTotalPages(response.meta.totalPages);
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDocentes();
  }, [search, currentPage, pageSize, filters]);

  const renderRow = (item: Clase) => (
    <div
      key={item.id_clase}
      className="bg-white shadow-2xl rounded-lg p-6 mb-6 w-full max-w-sm mx-auto lg:max-w-md flex flex-col justify-between h-auto"
    >
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold text-gray-800 truncate">
          {item.nombre} ({item.materia.semestre.nombre})
        </h3>
        <Link href={`inscritos/${item.id_clase}`}>
          <button className="bg-royalBlue text-white px-4 py-2 rounded-md hover:bg-royalBlue-dark transition">
            <IoPeopleOutline className="w-6 h-6 inline-block" />
          </button>
        </Link>
      </div>

      <p className="text-sm text-gray-600 mt-2">
        <strong>Materia:</strong> {item.materia.nombre}
      </p>
      <p className="text-sm text-gray-600 mt-2">
        <strong>Especialidad:</strong> {item.materia.especialidad.nombre}
      </p>
      <p className="text-sm text-gray-600 mt-2">
        <strong>Capacidad:</strong> {item.capacidad_max}
      </p>
      <p className="text-sm text-gray-600 mt-2">
        <strong>Horario:</strong> {item.horario}
      </p>
      <p className="text-sm text-gray-600 mt-2">
        <strong>Aula:</strong> {item.aula}
      </p>
      <p className="text-sm text-gray-600 mt-2">
        <strong>Docente:</strong> {item.docente.nombres}{" "}
        {item.docente.apellidos}
      </p>

      <div className="flex items-center justify-around mt-4">
        <Link href={`clases/editar/${item.id_clase}`}>
          <button className="bg-royalBlue text-white px-4 py-2 rounded-md hover:bg-royalBlue-dark transition">
            <IoOptionsOutline className="w-5 me-2 h-5 inline-block" />
            Editar
          </button>
        </Link>

        {item.estado === "ACTIVO" ? (
          <button
            onClick={() => handleCambiarEstado(item.id_clase.toString())}
            className="flex justify-center items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition"
          >
            <IoRemoveCircleOutline className="w-5 h-5 me-2 inline-block" />
            Desactivar
          </button>
        ) : (
          <button
            onClick={() => handleCambiarEstado(item.id_clase.toString())}
            className="flex justify-center items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition"
          >
            <IoCheckmarkCircleOutline className="w-5 h-5 me-2 inline-block" />
            Activar
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-8">
        <Title title="Clases" />
        <div className="w-full rounded h-px bg-gray-300 my-6" />
        <div className="flex items-center justify-between">
          <div className="flex-col">
            <h1 className="hidden md:block text-xl font-semibold">
              Todas las clases
            </h1>
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
                href={"/clases/crear"}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {data.length === 0 ? (
            <div className="col-span-3 text-center text-gray-600">
              No hay datos disponibles
            </div>
          ) : (
            data.map((item) => renderRow(item))
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-center space-x-4">
            <label
              htmlFor="pageSize"
              className="text-sm text-gray-700 font-medium"
            >
              Items por página:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue transition"
            >
              <option value={1}>1</option>
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
          <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={
            handlePageChange
          } />
        </div>
      </div>
    </>
  );
}
