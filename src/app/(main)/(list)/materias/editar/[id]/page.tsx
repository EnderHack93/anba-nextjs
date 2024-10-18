"use client";
import { Title } from "@/components";
import { Especialidad } from "@/interfaces/entidades/especialidad";
import { Semestre } from "@/interfaces/entidades/semestre";
import { fetchEntidad, fetchEntidades, editarEntidad } from "@/services/common/apiService";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function EditarMateria({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    id_semestre: Number(0), // Cambiado a id_semestre
    id_especialidad: Number(0),
  });

  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [semestres, setSemestres] = useState<Semestre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const idMateria = params.id;

  // Función para cargar la materia existente
  const fetchMateria = async () => {
    try {
      const response = await fetchEntidad({
        entidad: "materias",
        id: idMateria,
      });
      if(response) setFormData(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la materia.",
      });
    }
  };

  // Función para cargar las especialidades
  const fetchEspecialidades = async () => {
    try {
      const response = await fetchEntidades({ entidad: "especialidades" });
      setEspecialidades(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Función para cargar los semestres
  const fetchSemestres = async () => {
    try {
      const response = await fetchEntidades({ entidad: "semestre" });
      setSemestres(response);
    } catch (err) {
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
      [name]: name === "id_especialidad" || name === "id_semestre" ? Number(value) : value,
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await editarEntidad({
        entidad: "materias",
        id: idMateria,
        data: formData,
      });

      Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "Se ha actualizado la materia",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        window.location.href = "/materias";
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la materia.",
      });
    }
  };

  useEffect(() => {
    fetchEspecialidades();
    fetchSemestres(); // Cargar semestres al iniciar
    fetchMateria(); // Cargar los datos de la materia al iniciar
  }, []);

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 mt-0 shadow-2xl">
        <div className="justify-center flex-col">
          <Title title="Editar Materia" className="flex md:justify-center" />
          {!isLoading && (
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
                    <option key={semestre.id_semestre} value={semestre.id_semestre}>
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
                <div className="">
                  <button
                    type="submit"
                    className="w-full bg-royalBlue text-white py-2 px-4 rounded-md hover:bg-royalBlue-dark transition duration-150 my-1"
                  >
                    Actualizar
                  </button>
                </div>
                <div className="">
                  <a
                    className="w-full block bg-emeraldGreen text-white py-2 px-4 rounded-md hover:bg-emeraldGreen-dark transition duration-150 my-1 text-center"
                    href={"/materias"}
                  >
                    Volver
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
