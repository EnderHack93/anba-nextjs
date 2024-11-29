"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import LoadingScreen from "@/components/ui/loading-page/page";
import UnauthorizedScreen from "@/components/ui/unautorized/page";
import { fetchEntidades, crearEntidad } from "@/services/common/apiService";
import { TableData, TablePagination, TableSearch, Title } from "@/components";
import { Evaluaciones } from "@/interfaces/entidades/evaluaciones";
import { IoOptionsOutline } from "react-icons/io5";
import { Clase } from "@/interfaces/entidades/clase";
import {
  changeScoreEvaluacion,
  initRegistrosByIdClase,
  confirmarNotas,
} from "@/services/evaluaciones/evaluaciones";
import { fetchClasesByDocente } from "@/services/docentes-endpoints/clases";

const columns = [
  {
    header: "Info estudiantes",
    accesor: "info",
    className: "table-cell md:hidden ",
  },
  {
    header: "Foto",
    accesor: "estudiante.img_perfil",
    className: "hidden md:table-cell",
  },
  {
    header: "Código",
    accesor: "estudiante.id_estudiante",
    className: "hidden md:table-cell",
  },
  {
    header: "Nombre Completo",
    accesor: "estudiante.nombres",
    className: "hidden md:table-cell",
  },
  {
    header: "Clase",
    accesor: "clase.nombre",
    className: "hidden md:table-cell",
  },
  { header: "Nota", accesor: "nota", className: "hidden md:table-cell" },
];

export default function PanelNotas() {
  const [clases, setClases] = useState([]);
  const [selectedClase, setSelectedClase] = useState<Clase>();
  const [selectedEvaluacion, setSelectedEvaluacion] = useState(""); // Estado para la evaluación seleccionada
  const [data, setData] = useState<Evaluaciones[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const { data: session, status } = useSession();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const fetchClases = async () => {
    try {
      const response = await fetchClasesByDocente(session?.user.accessToken);
      setClases(response);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotas = async () => {
    try {
      if (!selectedClase || !selectedEvaluacion) return;
      const response = await fetchEntidades({
        entidad: "evaluaciones",
        search: search,
        page: currentPage,
        limit: pageSize,
        filter: {
          "filter.clase.id_clase": selectedClase.id_clase.toString(),
          "filter.tipo_evaluacion": selectedEvaluacion,
        },
        token: session?.user.accessToken,
      });
      setData(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      console.error(err);
    }
  };
  const handleChangeScore = async (
    id_evaluacion: number,
    nombre: string,
    nota: number
  ) => {
    try {
      Swal.fire({
        title: `Editar Nota - ${nombre}`,
        html: `
          <div>
            <label for="newScore" style="font-size: 16px; font-weight: bold; margin-bottom: 8px; display: block;">
              Nota Actual: <span style="color: #2c7be5;">${nombre}</span>
            </label>
            <input 
              type="number" 
              id="newScore" 
              class="swal2-input"
              value=${nota}
              min="0" 
              max="100"
              step="1"
              style="margin-top: 8px;"
            />
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Actualizar",
        confirmButtonColor: "#2c7be5",
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#d33",
        preConfirm: () => {
          const newScore = parseFloat(
            (document.getElementById("newScore") as HTMLInputElement).value
          );

          if (isNaN(newScore) || newScore < 0 || newScore > 100) {
            Swal.showValidationMessage(
              "Por favor, ingresa una nota válida entre 0 y 100."
            );
          }

          return newScore;
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const newScore = result.value;

          // Petición POST para actualizar la nota
          try {
            const response = await changeScoreEvaluacion(
              id_evaluacion,
              newScore,
              session?.user.accessToken
            );

            Swal.fire({
              title: "Nota Actualizada",
              text: `La nota de ${nombre} fue actualizada a ${newScore}`,
              icon: "success",
              confirmButtonText: "Aceptar",
            });

            // Lógica adicional para refrescar los datos de la tabla
            fetchNotas();
          } catch (err) {
            Swal.fire({
              title: "Error",
              text: "No se pudo actualizar la nota. Inténtelo nuevamente.",
              icon: "error",
              confirmButtonText: "Aceptar",
            });
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleInitializeEvaluaciones = async () => {
    try {
      if (selectedClase) {
        await initRegistrosByIdClase(
          selectedClase.id_clase,
          selectedEvaluacion,
          session?.user.accessToken
        );
        fetchNotas();
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al inicializar los registros.",
      });
    }
  };

  const handleConfirmarNotas = async () => {
    try {
      if (!selectedClase || !selectedEvaluacion) return;
      await confirmarNotas(
        selectedClase.id_clase,
        selectedEvaluacion,
        session?.user.accessToken
      );
      Swal.fire({
        icon: "success",
        title: "Notas confirmadas",
        text: "Las notas han sido confirmadas con éxito.",
      });
      fetchNotas();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al confirmar las notas.",
      });
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchClases();
  }, [status]);

  useEffect(() => {
    if (selectedClase && selectedEvaluacion) fetchNotas();
  }, [selectedClase, selectedEvaluacion, search, currentPage, pageSize]);

  const allNotasActivas =
    data.length > 0 && data.every((item) => item.estado.nombre === "ACTIVO");
  console.log(allNotasActivas);

  const renderRow = (item: Evaluaciones) => (
    <tr key={item.id_evaluacion} className="py-3">
      <td className="table-cell md:hidden">
        <span className="flex items-center">
          <div className="w-20 h-20 rounded-full bg-gray-300 me-4">
            <Image
              src={item.estudiante.img_perfil}
              alt={item.estudiante.nombres + " " + item.estudiante.apellidos}
              className="w-full h-full rounded-full"
              width={100}
              height={100}
            />
          </div>
          <div className="flex-col justify-start">
            <div className="text-gray-500 text-sm">
              {item.estudiante.id_estudiante}
            </div>
            <div className="text-gray-500 text-sm">
              {item.estudiante.nombres} {item.estudiante.apellidos}
            </div>
            <div className="text-gray-500 text-sm">
              {item.estudiante.carnet}
            </div>
          </div>
        </span>
      </td>
      <td className="hidden md:table-cell">
        <div className="w-20 h-20 rounded-full bg-gray-300 me-4">
          <Image
            src={item.estudiante.img_perfil}
            alt={item.estudiante.nombres + " " + item.estudiante.apellidos}
            className="w-full h-full rounded-full"
            width={100}
            height={100}
          />
        </div>
      </td>
      <td className="hidden md:table-cell">{item.estudiante.id_estudiante}</td>
      <td className="hidden md:table-cell">
        {item.estudiante.nombres} {item.estudiante.apellidos}
      </td>
      <td className="hidden md:table-cell">{item.clase.nombre}</td>
      <td>
        <button
          onClick={() =>
            item.estado.nombre === "ACTIVO"
              ? handleChangeScore(
                  item.id_evaluacion,
                  `${item.estudiante.nombres} ${item.estudiante.apellidos}`,
                  item.nota
                )
              : null
          }
          className={`p-2 rounded-xl min-w-12 text-white font-bold text-2xl sm:text-lg ${
            item.nota >= 75
              ? "bg-green-500"
              : item.nota >= 50
              ? "bg-yellow-500"
              : "bg-red-500"
          }  ${item.estado.nombre === "ACTIVO" ? "" : "opacity-50 disabled:"}`}
        >
          {item.nota} <span className="text-lg sm:text-sm">Pts.</span>
        </button>
      </td>
    </tr>
  );

  if (status === "loading") return <LoadingScreen />;
  if (status === "unauthenticated" || session?.user.rol !== "DOCENTE")
    return <UnauthorizedScreen />;

  return (
    <div className="flex-wrap justify-center items-center">
      <div className="bg-white lg:w-3/4  xl:w-1/2 justify-self-center p-6 rounded-md flex-1 m-4 shadow-xl">
        <Title title="Panel de Evaluación" />
        <div className="w-full rounded h-px bg-gray-300 my-6" />
        <div className="flex-row p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 m-4 gap-4">
            <div>
              <label
                htmlFor="clase-select"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Seleccionar Clase
              </label>
              <select
                id="clase-select"
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={selectedClase?.id_clase}
                onChange={(e) =>
                  setSelectedClase(
                    clases.find(
                      (clase: Clase) =>
                        clase.id_clase.toString() === e.target.value
                    )
                  )
                }
              >
                <option value="">Seleccione una clase</option>
                {clases.map((clase: any) => (
                  <option key={clase.id_clase} value={clase.id_clase}>
                    {clase.nombre}
                  </option>
                ))}
              </select>
            </div>
            {selectedClase && (
              <div>
                <label
                  htmlFor="evaluacion-select"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Seleccionar Evaluación
                </label>
                <select
                  id="evaluacion-select"
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={selectedEvaluacion}
                  onChange={(e) => setSelectedEvaluacion(e.target.value)}
                >
                  <option value="">Seleccione una evaluación</option>
                  <option value="Primera Evaluacion Parcial">
                    Primera Evaluación Parcial
                  </option>
                  <option value="Segunda Evaluacion Parcial">
                    Segunda Evaluación Parcial
                  </option>
                  <option value="Evaluacion Final">Evaluación Final</option>
                </select>
              </div>
            )}
          </div>
          <div className="m-4 flex justify-end">
            {selectedClase && selectedEvaluacion && allNotasActivas ? (
              <button
                className="bg-royalBlue text-white px-4 py-2 rounded-md hover:bg-royalBlue-dark w-full md:w-auto"
                onClick={handleConfirmarNotas}
              >
                Confirmar Evaluacion
              </button>
            ) : null}
          </div>
        </div>
        {selectedClase &&
          selectedEvaluacion &&
          (data.length > 0 ? (
            <>
              <TableSearch
                value={search}
                onSearchChange={(e) => setSearch(e.target.value)}
              />
              <div className="overflow-x-auto">
                <TableData
                  columns={columns}
                  data={data}
                  renderRow={renderRow}
                />
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
              </div>
              <div className="mt-4">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="mt-4">
              <p className="text-gray-500 mb-4">
                No se encontraron registros para esta evaluación.
              </p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleInitializeEvaluaciones}
              >
                Inicializar Registros
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
