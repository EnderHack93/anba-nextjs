"use client";
import { Title } from "@/components";
import { Especialidad } from "@/interfaces/entidades/especialidad";
import { crearEntidad, fetchEntidades } from "@/services/apiService";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function crearMateria() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    semestre: "",
    id_especialidad: Number(0),
  });

  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);

  // Función para cargar las especialidades
  const fetchEspecialidades = async () => {
    try {
      const response = await fetchEntidades({ entidad: "especialidades" });
      setEspecialidades(response.data);
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
      [name]: name === "id_especialidad" ? Number(value) : value,
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await crearEntidad({
        entidad: "materias",
        data: formData,
      });

      Swal.fire({
        icon: "success",
        title: "Creado",
        text: "Se ha creado la materia",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        window.location.href = "/materias";
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 mt-0 shadow-2xl">
        <div className="justify-center flex-col">
          <Title title="Crear Materia" className="flex md:justify-center" />
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
                htmlFor="semestre"
                className="block text-sm font-medium text-gray-700"
              >
                Semestre *
              </label>
              <input
                required
                type="text"
                id="semestre"
                name="semestre"
                value={formData.semestre}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                placeholder="Ingrese el semestre"
              />
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
                  Registrar
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
        </div>
      </div>
    </>
  );
}
