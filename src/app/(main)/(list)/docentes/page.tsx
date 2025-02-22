"use client";
import { TableData, TablePagination, TableSearch, Title } from "@/components";
import { FilterComponent } from "@/components/ui/table/Filters/docentesFilters";
import { Docente } from "@/interfaces/entidades/docente";
import Image from "next/image";
import { desactivarEntidad, fetchEntidades } from "@/services/common/apiService";
import {
  faCircleXmark,
  faEnvelope,
  faFilter,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoOptionsOutline,
  IoRemoveCircleOutline,
} from "react-icons/io5";
import Swal from "sweetalert2";

const columns = [
  {
    header: "Info",
    accesor: "info",
    className: "table-cell md:hidden ",
  },

  {
    header: "Foto",
    accesor: "foto",
    className: "hidden md:table-cell",
  },
  {
    header: "Codigo",
    accesor: "codigo",
    className: "hidden md:table-cell",
  },

  {
    header: "Nombre completo",
    accesor: "nombres",
    className: "hidden md:table-cell",
  },
  {
    header: "Especialidad",
    accesor: "especialidad",
    className: "hidden md:table-cell",
  },
  {
    header: "Correo",
    accesor: "correo",
    className: "hidden lg:table-cell",
  },
  {
    header: "Carnet",
    accesor: "carnet",

    className: "hidden md:table-cell",
  },
  {
    header: "Acciones",
    accesor: "acciones",
  },
];

const columnsFilter = [
  {
    key: "especialidad.nombre",
    label: "Especialidad",
    entidad: "especialidades",
  },
  {
    key: "estado.nombre",
    label: "Estado",
    values: [
      { key: "ACTIVO", label: "ACTIVO" },
      { key: "INACTIVO", label: "INACTIVO" },
    ],
  },
];
export default function ListaDocentes() {
  const [data, setData] = useState([]);
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
      text: "Estas cambiando el estado del docente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4169E1",
      cancelButtonColor: "#FF4040",
      confirmButtonText: "Si, cambiar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        desactivarEntidad({ entidad: "docentes", id })
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Cambiado",
              text: "Se ha cambiado el estado del docente",
              showConfirmButton: false,
              timer: 1000,
            });
            fetchDocentes();
          })

          .catch((err) => {
            console.error("Error al cambiar el estado del docente:", err);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo cambiar el estado del docente",
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
        entidad: "docentes",
        search: search,
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

  const renderRow = (item: Docente) => (
    <tr key={item.id_docente} className="py-3">
      <td className="table-cell md:hidden">
        <span className="flex items-center">
        <div className="w-20 h-20 rounded-full bg-gray-300 me-4">
            <Image
              src={item.img_perfil}
              alt={item.nombres + " " + item.apellidos}
              className="w-full h-full rounded-full"
              width={100}
              height={100}
            />
          </div>
          <div className="flex-col justify-start">
            <div className="text-gray-500 text-sm">{item.nombres}</div>
            <div className="text-gray-500 text-sm">{item.apellidos}</div>
            <div className="text-gray-500 text-sm">{item.carnet}</div>
            <div className="text-gray-500 text-sm">
              {item.especialidad.nombre}
            </div>
          </div>
        </span>
      </td>
      <td className="hidden md:table-cell">
      <div className="w-14 h-14 rounded-full bg-gray-300 me-4">
            <Image
              src={item.img_perfil}
              alt={item.nombres + " " + item.apellidos}
              className="w-full h-full rounded-full"
              width={50}
              height={50}
            />
          </div>
      </td>
      <td className="hidden md:table-cell">{item.id_docente}</td>
      <td className="hidden md:table-cell">{item.nombres}</td>
      <td className="hidden md:table-cell">{item.especialidad.nombre}</td>
      <td className="hidden lg:table-cell">{item.correo}</td>
      <td className="hidden md:table-cell">{item.carnet}</td>
      <td>
        <span className="flex sm:flex-col md:flex xl:flex-row gap-2 justify-start ">
          <div className="my-2 md:my-0 w-full xl:w-auto">
            <Link href={`docentes/editar/${item.id_docente}`}>
              <span className="flex items-center py-1 px-1 md:px-3 rounded-lg justify-center bg-royalBlue text-white">
                <IoOptionsOutline className=" me-0 sm:me-1 w-6 h-6  md:w-5 md:h-5" />
                <span className="text-lg hidden sm:block">Editar</span>
              </span>
            </Link>
          </div>
          <div className="my-2 md:my-0 w-full xl:w-auto">
            {(() => {
              if (item.estado.nombre == "ACTIVO") {
                return (
                  <button
                    className="w-full"
                    onClick={() => handleCambiarEstado(item.id_docente)}
                  >
                    <span className="flex items-center py-1 px-1 md:px-3 rounded-lg justify-center bg-coralRed text-white">
                      <IoRemoveCircleOutline className=" me-0 sm:me-1 w-6 h-6  md:w-5 md:h-5" />
                      <span className="text-lg hidden sm:block">
                        Desactivar
                      </span>
                    </span>
                  </button>
                );
              } else {
                return (
                  <button
                    className="w-full"
                    onClick={() => handleCambiarEstado(item.id_docente)}
                  >
                    <span className="flex items-center py-1 px-1 md:px-3 rounded-lg justify-center bg-green-600 text-white">
                      <IoCheckmarkCircleOutline className=" me-0 sm:me-1 w-6 h-6  md:w-5 md:h-5" />
                      <span className="text-lg hidden sm:block">Activar</span>
                    </span>
                  </button>
                );
              }
            })()}
          </div>
        </span>
      </td>
    </tr>
  );

  return (
    <div className="w-full overflow-auto">
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-6">
      <Title title="Docentes" />
      <div className="w-full rounded h-px bg-gray-300 my-6" />
        <div className="flex items-center justify-between">
          <div className="flex-col">
            <h1 className="hidden md:block text-xl font-semibold">
              Todos los docentes
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
                href={"/docentes/crear"}
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
                const column = columnsFilter.find((el) => "filter."+el.key === key);
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

        <div className="">
          {data.length === 0 ? (
            <div>No hay datos disponibles</div>
          ) : (
            <TableData columns={columns} renderRow={renderRow} data={data} />
          )}
        </div>
        <div className="">
          <div className="flex items-center mt-4 md:mt-0 justify-center">
            <div className="flex items-center space-x-3">
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
                className="p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue-light transition ease-in-out duration-150"
              >
                <option value={1}>1</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
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
    </div>
  );
}
