"use client";
import { Title } from "@/components";
import LoadingScreen from "@/components/ui/loading-page/page";
import { Especialidad } from "@/interfaces/entidades/especialidad";
import { Semestre } from "@/interfaces/entidades/semestre";
import {
  fetchEntidad,
  fetchEntidades,
  editarEntidad,
} from "@/services/common/apiService";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function EditarMateria({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    id_semestre: 0,
    id_especialidad: 0,
  });

  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [semestres, setSemestres] = useState<Semestre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const idMateria = params.id;

  // Función para cargar los datos de la materia
  const fetchMateria = async () => {
    try {
      const response = await fetchEntidad({
        entidad: "materias",
        id: idMateria,
      });
      if (response && response.data) {
        setFormData({
          nombre: response.data.nombre || "",
          descripcion: response.data.descripcion || "",
          id_semestre: response.data.semestre?.id_semestre || 0,
          id_especialidad: response.data.especialidad?.id_especialidad || 0,
        });
      } else {
        throw new Error("Datos de la materia no disponibles");
      }
    } catch (err) {
      setError("No se pudo cargar la información de la materia.");
      console.error(err);
    }
  };

  // Función para cargar las especialidades
  const fetchEspecialidades = async () => {
    try {
      const response = await fetchEntidades({ entidad: "especialidades" });
      if (response && response.data) {
        setEspecialidades(response.data);
      } else {
        throw new Error("No se pudieron cargar las especialidades.");
      }
    } catch (err) {
      setError("No se pudieron cargar las especialidades.");
      console.error(err);
    }
  };

  // Función para cargar los semestres
  const fetchSemestres = async () => {
    try {
      const response = await fetchEntidades({ entidad: "semestre" });
      if (response) {
        setSemestres(response);
      } else {
        throw new Error("No se pudieron cargar los semestres.");
      }
    } catch (err) {
      setError("No se pudieron cargar los semestres.");
      console.error(err);
    }
  };

  // Manejar los cambios en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "id_especialidad" || name === "id_semestre"
          ? Number(value)
          : value,
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await editarEntidad({
        entidad: "materias",
        id: idMateria,
        data: formData,
      });

      if (response?.success) {
        Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "La materia se actualizó correctamente",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          window.location.href = "/materias";
        });
      } else {
        throw new Error(response?.error?.message || "Error desconocido");
      }
    } catch (err:any) {
      console.error("Error al actualizar la materia:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo actualizar la materia.",
        confirmButtonColor: "#FF4040",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Limpia cualquier error previo
        await Promise.all([fetchEspecialidades(), fetchSemestres(), fetchMateria()]);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos. Por favor, intente nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-md shadow-md text-center">
        <h1 className="text-xl font-semibold text-red-500">Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 mt-4 shadow-2xl">
        <div className="justify-center flex-col">
          <Title title="Editar Materia" className="flex md:justify-center" />
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg max-w-md md:max-w-lg mt-5 mb-5 mx-auto"
          >
            <div className="mb-4">
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre *
              </label>
              <input
                required
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                placeholder="Ingrese el nombre de la materia"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-gray-700"
              >
                Descripción *
              </label>
              <input
                required
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                placeholder="Ingrese la descripción de la materia"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="id_semestre"
                className="block text-sm font-medium text-gray-700"
              >
                Semestre *
              </label>
              <select
                required
                id="id_semestre"
                name="id_semestre"
                value={formData.id_semestre}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
              >
                <option value="">Seleccione un semestre</option>
                {semestres.map((semestre) => (
                  <option
                    key={semestre.id_semestre}
                    value={semestre.id_semestre}
                  >
                    {semestre.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="id_especialidad"
                className="block text-sm font-medium text-gray-700"
              >
                Especialidad *
              </label>
              <select
                required
                id="id_especialidad"
                name="id_especialidad"
                value={formData.id_especialidad}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
              >
                <option value="">Seleccione una especialidad</option>
                {especialidades.map((especialidad) => (
                  <option
                    key={especialidad.id_especialidad}
                    value={especialidad.id_especialidad}
                  >
                    {especialidad.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-col">
              <button
                type="submit"
                className="w-full bg-royalBlue text-white py-2 px-4 rounded-md hover:bg-royalBlue-dark transition duration-150 my-1"
              >
                Actualizar
              </button>
              <a
                className="w-full block bg-emeraldGreen text-white py-2 px-4 rounded-md hover:bg-emeraldGreen-dark transition duration-150 my-1 text-center"
                href={"/materias"}
              >
                Volver
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
