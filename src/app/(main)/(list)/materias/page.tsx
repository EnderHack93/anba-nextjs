"use client";
import { TablePagination, TableSearch, Title } from "@/components";
import LoadingScreen from "@/components/ui/loading-page/page";
import { FilterComponent } from "@/components/ui/table/Filters/docentesFilters";
import UnauthorizedScreen from "@/components/ui/unautorized/page";
import { Materia } from "@/interfaces/entidades/materia";
import {
  desactivarEntidad,
  fetchEntidades,
} from "@/services/common/apiService";
import {
  faCircleXmark,
  faFilter,
  faPenToSquare,
  faPlus,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoOptionsOutline,
  IoRemoveCircleOutline,
} from "react-icons/io5";
import Swal from "sweetalert2";

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
  {
    key: "semestre",
    label: "Semestre",
    values: [
      { key: "1", label: "1" },
      { key: "2", label: "2" },
      { key: "3", label: "3" },
      { key: "4", label: "4" },
      { key: "5", label: "5" },
      { key: "6", label: "6" },
      { key: "7", label: "7" },
    ],
  },
];

export default function ListaMaterias() {
  const [data, setData] = useState<Materia[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );
  const { data: session, status } = useSession();

  const handleCambiarEstado = (id: string) => {
    Swal.fire({
      title: "¿Estás seguro de cambiar el estado?",
      text: "El estado de la materia será modificado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4169E1",
      cancelButtonColor: "#FF4040",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
      customClass: {
        popup: "rounded-lg shadow-md",
        title: "text-lg font-semibold text-gray-800",
        htmlContainer: "text-sm text-gray-600",
        confirmButton:
          "px-4 py-2 rounded-md bg-royalBlue text-white hover:bg-royalBlue-dark transition duration-200",
        cancelButton:
          "px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-200",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        desactivarEntidad({ entidad: "materias", id })
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Estado actualizado",
              text: "El estado de la materia se ha cambiado con éxito.",
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
              toast: true,
              position: "top-end",
              customClass: {
                popup: "rounded-lg shadow-md",
                title: "text-lg font-semibold text-royalBlue-dark",
                htmlContainer: "text-sm text-gray-600",
              },
            });
            fetchMaterias();
          })
          .catch((err) => {
            console.error("Error al cambiar el estado de la materia:", err);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo cambiar el estado de la materia.",
              showConfirmButton: true,
              confirmButtonText: "Cerrar",
              confirmButtonColor: "#FF4040",
              customClass: {
                popup: "rounded-lg shadow-md",
                title: "text-lg font-semibold text-red-600",
                htmlContainer: "text-sm text-gray-600",
                confirmButton:
                  "px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-200",
              },
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

  const fetchMaterias = async () => {
    try {
      const response = await fetchEntidades({
        entidad: "materias",
        search: search,
        page: currentPage,
        limit: pageSize,
        filter: filters,
        token: session?.user.accessToken,
      });
      const data = response.data;
      setTotalPages(response.meta.totalPages);
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessToken) {
      fetchMaterias();
    }
  }, [status, search, currentPage, pageSize, filters, session]);

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (status === "unauthenticated" || session?.user.rol !== "DOCENTE") {
    return <UnauthorizedScreen />;
  }

  const renderCard = (item: Materia) => (
    <div
      key={item.id_materia}
      className="bg-white shadow-2xl rounded-lg p-4 mb-6 w-full max-w-sm mx-auto lg:max-w-md flex flex-col justify-between h-64"
    >
      <h3 className="text-lg font-semibold text-gray-800 truncate">
        {item.nombre}
      </h3>
      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
        {item.descripcion}
      </p>
      <p className="text-sm text-gray-600 mt-2">
        Semestre: {item.semestre.nombre}
      </p>
      <p className="text-sm text-gray-600 mt-2">
        Especialidad: {item.especialidad.nombre}
      </p>

      <div className="flex items-center justify-around mt-4">
        <Link href={`materias/editar/${item.id_materia}`}>
          <button className="bg-royalBlue text-white px-4 py-2 rounded-md hover:bg-royalBlue-dark transition items-center flex">
            <FontAwesomeIcon
              className="w-5 h-5 me-1 inline-block"
              icon={faPenToSquare}
            />
            Editar
          </button>
        </Link>

        {item.estado === "ACTIVO" ? (
          <button
            onClick={() => handleCambiarEstado(item.id_materia.toString())}
            className="flex justify-center items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition"
          >
            <IoRemoveCircleOutline className="me-1 w-6 h-6 md:w-5 md:h-5" />
            Desactivar
          </button>
        ) : (
          <button
            onClick={() => handleCambiarEstado(item.id_materia.toString())}
            className="flex justify-center items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition"
          >
            <IoCheckmarkCircleOutline className="me-1 w-6 h-6 md:w-5 md:h-5" />
            Activar
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-gray-50 p-4 rounded-md flex-1 m-4 mt-6">
        <Title title="Materias" />
        <div className="w-full rounded h-px bg-gray-300 my-6" />
        <div className="flex items-center justify-between">
          <div className="flex-col">
            <h1 className="hidden md:block text-xl font-semibold ">
              Todas las materias
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
                href={"/materias/crear"}
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

        <div className="mt-4">
          {Object.entries(appliedFilters).length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">Filtros Aplicados:</h2>
              <ul className="flex flex-wrap gap-2 mt-2">
                {Object.entries(appliedFilters).map(([key, value]) => {
                  const cleanedKey = key.replace(/^filter\./, "");
                  const column = columnsFilter.find(
                    (elemento) => elemento.key === cleanedKey
                  );
                  return (
                    <li
                      key={key}
                      className="bg-royalBlue text-white rounded-full px-3 py-1 flex items-center"
                    >
                      <span className="mr-2">
                        {column ? column.label : key}: {value}
                      </span>
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        onClick={() => handleRemoveFilter(key)}
                        className="text-lg cursor-pointer hover:shadow-xl"
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {data.length === 0 ? (
            <div className="col-span-3 text-center text-gray-600">
              No hay datos disponibles
            </div>
          ) : (
            data.map((item) => renderCard(item))
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
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
