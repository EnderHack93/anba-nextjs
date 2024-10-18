"use client";
import { Title } from "@/components";
import { Especialidad } from "@/interfaces/entidades/especialidad";
import {
  editarEntidad,
  fetchEntidad,
  fetchEntidades,
} from "@/services/common/apiService";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function EditarMateria({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const idMateria = params.id;

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    semestre: "",
    id_especialidad: 0,
  });

  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [originalData, setOriginalData] = useState({
    nombre: "",
    descripcion: "",
    semestre: "",
    id_especialidad: 0,
  });

  // Cargar especialidades
  const fetchEspecialidades = async () => {
    try {
      const response = await fetchEntidades({ entidad: "especialidades" });
      setEspecialidades(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Cargar la materia
  const fetchMateria = async (id: string) => {
    try {
      const response = await fetchEntidad({ entidad: "materias", id });

      if (response && response.data) {
        setFormData({
          nombre: response.data.nombre || "",
          descripcion: response.data.descripcion || "",
          semestre: response.data.semestre || "",
          id_especialidad: response.data.especialidad.id_especialidad || 0,
        });

        setOriginalData({
          nombre: response.data.nombre || "",
          descripcion: response.data.descripcion || "",
          semestre: response.data.semestre || "",
          id_especialidad: response.data.especialidad.id_especialidad || 0,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener la información de la materia",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.href = "/materias";
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "id_especialidad" ? Number(value) : value,
    });
  };

  // Obtener solo los datos modificados
  const getModifiedData = () => {
    const modifiedData: Partial<any> = {};

    Object.keys(formData).forEach((key) => {
      if (
        formData[key as keyof typeof formData] !==
        originalData[key as keyof typeof originalData]
      ) {
        modifiedData[key as keyof typeof formData] =
          formData[key as keyof typeof formData];
      }
    });

    return modifiedData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const modifiedData = getModifiedData();

    if (Object.keys(modifiedData).length === 0) {
      Swal.fire("No hay cambios", "No has realizado ningún cambio.", "info");
      return;
    }

    try {
      await editarEntidad({
        entidad: "materias",
        data: modifiedData,
        id: idMateria,
      });

      Swal.fire({
        icon: "success",
        title: "Editado",
        text: "Se ha editado la materia",
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
    fetchMateria(idMateria);
    fetchEspecialidades();
  }, [idMateria]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0 shadow-2xl">
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
              Nombre
            </label>
            <input
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
              Descripción
            </label>
            <input
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
              Semestre
            </label>
            <input
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
              Especialidad
            </label>
            <select
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
                Editar
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
  );
}
