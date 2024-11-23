"use client";
import { Title } from "@/components";
import { useEffect, useState } from "react";
import {
  fetchEntidad,
  fetchEntidades,
  crearEntidad,
  eliminarEntidad,
} from "@/services/common/apiService";
import Swal from "sweetalert2";
import { Inscrito } from "@/interfaces/entidades/inscrito";
import { Clase } from "@/interfaces/entidades/clase";
import { Estudiante } from "@/interfaces/entidades/estudiante";
import { fetchEstudiantesNoInscritosMateria } from "@/services/estudiantes/estudiantes";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/components/ui/loading-page/page";
import UnauthorizedScreen from "@/components/ui/unautorized/page";

export default function InscritosClase({
  params,
}: {
  params: { id_clase: string };
}) {
  const idClase = params.id_clase;
  const [clase, setClase] = useState<Clase | null>(null);
  const [inscritos, setInscritos] = useState<Inscrito[]>([]);
  const [filteredInscritos, setFilteredInscritos] = useState<Inscrito[]>([]);
  const [estudiantesNoInscritos, setEstudiantesNoInscritos] = useState<
    Estudiante[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const { data: session, status } = useSession();

  // Obtener la clase por ID
  const fetchClase = async (id: string) => {
    try {
      const response = await fetchEntidad({
        entidad: `clases`,
        id,
      });
      if (response) {
        setClase(response.data);
        fetchEstudiantesNoInscritos(response.data.materia.id_materia);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo obtener la información de la clase.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  // Obtener los estudiantes ya inscritos
  const fetchInscritos = async (id_clase: string) => {
    try {
      const response = await fetchEntidades({
        entidad: `inscritos`,
        filter: { id_clase },
      });
      setInscritos(response.data);
      setFilteredInscritos(response.data);
      setIsLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo obtener la lista de inscritos.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  // Obtener estudiantes no inscritos en la clase o en la misma materia
  const fetchEstudiantesNoInscritos = async (id_materia: number) => {
    try {
      const response = await fetchEstudiantesNoInscritosMateria(
        id_materia,
        session?.user.accessToken
      );
      setEstudiantesNoInscritos(response);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo obtener la lista de estudiantes no inscritos.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (status === "authenticated") {
      fetchClase(idClase);
      fetchInscritos(idClase);
    }
  }, [status,idClase]);

  if (status === "loading") {
    // Renderizar una pantalla de carga mientras se obtiene la sesión
    return <LoadingScreen/>;
  }

  console.log({status,session})
  if (status === "unauthenticated" || session?.user.rol != "ADMIN") {
    // Si el usuario no está autenticado, redirigirlo o mostrar un mensaje
    return <UnauthorizedScreen/>;
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const filtered = inscritos.filter((inscrito) =>
      `${inscrito.estudiante.nombres} ${inscrito.estudiante.apellidos}`
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
    );
    setFilteredInscritos(filtered);
  };

  // Agregar estudiante con la fecha actual automáticamente
  const handleAgregarEstudiante = async () => {
    const optionsHtml = estudiantesNoInscritos.map((estudiante) => {
      return `<option value="${estudiante.id_estudiante}">${estudiante.nombres} ${estudiante.apellidos}</option>`;
    });

    const { value: formValues } = await Swal.fire({
      title: "Agregar Estudiante",
      html: `
        <select id="estudianteSelect" class="swal2-input">
          ${optionsHtml.join("")}
        </select>
        <input id="fecha_inscripcion" hidden type="date" class="swal2-input" value="${
          new Date().toISOString().split("T")[0]
        }" readonly>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const id_estudiante = (
          document.getElementById("estudianteSelect") as HTMLSelectElement
        )?.value;
        const fecha_inscripcion = (
          document.getElementById("fecha_inscripcion") as HTMLInputElement
        )?.value;

        if (!id_estudiante || !fecha_inscripcion) {
          Swal.showValidationMessage("Debe seleccionar un estudiante y fecha");
          return null;
        }
        return { id_estudiante, fecha_inscripcion };
      },
    });

    if (formValues) {
      try {
        const requestData = {
          fecha_inscripcion: formValues.fecha_inscripcion,
          id_estudiante: formValues.id_estudiante,
          id_clase: Number(idClase),
        };

        await crearEntidad({
          entidad: "inscritos",
          data: requestData,
        });

        Swal.fire("Inscrito", "El estudiante ha sido inscrito.", "success");
        fetchInscritos(idClase);
        if (clase) fetchEstudiantesNoInscritos(clase.materia.id_materia); // Refrescar la lista de estudiantes después de agregar
      } catch (error) {
        Swal.fire("Error", "No se pudo inscribir al estudiante.", "error");
      }
    }
  };

  const handleEliminarEstudiante = async (id_inscrito: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Eliminarás al estudiante de la clase.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarEntidad({
            entidad: "inscritos",
            id: id_inscrito,
          });

          Swal.fire("Eliminado", "El estudiante ha sido eliminado.", "success");

          fetchInscritos(idClase);
          if (clase) fetchEstudiantesNoInscritos(clase.materia.id_materia); // Refrescar la lista de estudiantes después de eliminar
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar al estudiante.", "error");
        }
      }
    });
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredInscritos.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white rounded-md p-4 mt-4 shadow-lg">
      <div className="sm:flex justify-between items-center mb-4">
        <Title title="Lista de Estudiantes Inscritos" />
        <button
          onClick={() => (window.location.href = "/clases")}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md transition duration-150"
        >
          Volver a Clases
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clase && (
          <div className="bg-gray-100 p-4 rounded-md col-span-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {clase.nombre}
            </h2>
            <p className="text-gray-700">
              <strong>Capacidad:</strong> {clase.capacidad_max} estudiantes
            </p>
            <p className="text-gray-700">
              <strong>Horario:</strong> {clase.horario}
            </p>
            <p className="text-gray-700">
              <strong>Aula:</strong> {clase.aula}
            </p>
            <p className="text-gray-700">
              <strong>Gestión:</strong> {clase.materia.semestre.gestion}
            </p>
            <p className="text-gray-700">
              <strong>Materia:</strong> {clase.materia.nombre}
            </p>
            <p className="text-gray-700">
              <strong>Docente:</strong> {clase.docente.nombres}
            </p>
          </div>
        )}

        <div className="col-span-2">
          <div className="sm:flex gap-2 justify-between items-center mb-4">
            <div className=" my-1 sm:m-0 w-full sm:w-72">
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={searchTerm}
                onChange={handleSearch}
                className="px-4 py-2 border w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue"
              />
            </div>
            <button
              onClick={handleAgregarEstudiante}
              className="bg-emeraldGreen hover:bg-emeraldGreen-dark text-white py-2 px-4 my-1 sm:m-0 rounded-md transition w-full sm:w-72 duration-150"
            >
              Agregar Estudiante
            </button>
          </div>

          {/* Tabla de estudiantes inscritos */}
          <div className="overflow-y-auto max-h-80">
            {isLoading ? (
              <div className="text-center py-6">
                <span className="text-royalBlue font-bold">
                  Cargando estudiantes...
                </span>
              </div>
            ) : filteredInscritos.length === 0 ? (
              <div className="text-center py-6">
                <span className="text-gray-600">
                  No hay estudiantes inscritos en esta clase.
                </span>
              </div>
            ) : (
              <div>
                <table className="min-w-full bg-white border border-gray-200 rounded-md hidden lg:block">
                  <thead>
                    <tr>
                      <th className="text-left px-6 py-3 border-b font-semibold text-gray-700">
                        Nombres
                      </th>
                      <th className="text-left px-6 py-3 border-b font-semibold text-gray-700">
                        Apellidos
                      </th>
                      <th className="text-left px-6 py-3 border-b font-semibold text-gray-700">
                        Correo
                      </th>
                      <th className="text-left px-6 py-3 border-b font-semibold text-gray-700">
                        Fecha de Inscripción
                      </th>
                      <th className="text-left px-6 py-3 border-b font-semibold text-gray-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.map((inscrito: Inscrito) => (
                      <tr
                        key={inscrito.id_inscrito}
                        className="hover:bg-gray-100"
                      >
                        <td className="px-6 py-4 border-b text-gray-800">
                          {inscrito.estudiante.nombres}
                        </td>
                        <td className="px-6 py-4 border-b text-gray-800">
                          {inscrito.estudiante.apellidos}
                        </td>
                        <td className="px-6 py-4 border-b text-gray-800">
                          {inscrito.estudiante.correo}
                        </td>
                        <td className="px-6 py-4 border-b text-gray-800">
                          {new Date(
                            inscrito.fecha_inscripcion
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 border-b text-gray-800">
                          <button
                            onClick={() =>
                              handleEliminarEstudiante(
                                inscrito.id_inscrito.toString()
                              )
                            }
                            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-150"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Vista en formato tarjetas para pantallas pequeñas */}
                <div className="lg:hidden">
                  {currentStudents.map((inscrito: Inscrito) => (
                    <div
                      key={inscrito.id_inscrito}
                      className="bg-gray-100 rounded-lg p-4 mb-4"
                    >
                      <p className="text-lg font-semibold text-gray-800">
                        {inscrito.estudiante.nombres}{" "}
                        {inscrito.estudiante.apellidos}
                      </p>
                      <p className="text-gray-700">
                        <strong>Correo:</strong> {inscrito.estudiante.correo}
                      </p>
                      <p className="text-gray-700">
                        <strong>Fecha de Inscripción:</strong>{" "}
                        {new Date(
                          inscrito.fecha_inscripcion
                        ).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() =>
                          handleEliminarEstudiante(
                            inscrito.id_inscrito.toString()
                          )
                        }
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-150 mt-2"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-gray-700">
                Mostrando {indexOfFirstStudent + 1} a{" "}
                {Math.min(indexOfLastStudent, filteredInscritos.length)} de{" "}
                {filteredInscritos.length} estudiantes
              </span>
            </div>
            <div className="space-x-2">
              {[
                ...Array(
                  Math.ceil(filteredInscritos.length / studentsPerPage)
                ).keys(),
              ].map((number) => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`px-3 py-1 rounded-md text-sm font-semibold ${
                    currentPage === number + 1
                      ? "bg-royalBlue text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-royalBlue hover:text-white transition duration-200`}
                >
                  {number + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
