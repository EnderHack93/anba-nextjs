"use client";
import { Title } from "@/components";
import { fetchEntidad, editarEntidad } from "@/services/common/apiService";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function EditarEspecialidad({
  params,
}:{
  params: {
    id: string;
  };
}) {
  const id_especialidad = params.id

  const [formData, setFormData] = useState({
    nombre: "",
    duracion: 8,
  });

  // Función para manejar los cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "duracion" ? Number(value) : value,
    });
  };

  // Función para obtener los datos de la especialidad a editar
  const fetchEspecialidad = async () => {
    try {
      const response = await fetchEntidad({
        entidad: "especialidades",
        id: id_especialidad
      });
      if(response){
        setFormData({
            nombre: response.data.nombre,
            duracion: response.data.duracion || 8,
          });
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la especialidad",
      });
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await editarEntidad({
        entidad: "especialidades",
        id: id_especialidad,
        data: formData,
      });

      Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "Se ha actualizado la especialidad",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        window.location.href = "/especialidades"
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la especialidad",
      });
    }
  };

  // Efecto para cargar los datos de la especialidad cuando se monta el componente
  useEffect(() => {
    if (id_especialidad) {
      fetchEspecialidad();
    }
  }, [id_especialidad]);

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 mt-0 shadow-2xl">
        <div className="justify-center flex-col">
          <Title title="Editar Especialidad" className="flex md:justify-center" />
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg max-w-md md:max-w-lg mt-5 mb-5 mx-auto"
          >
            <div className="w-full mb-4">
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre de la Especialidad *
              </label>
              <input
                required
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                placeholder="Ingrese el nombre de la especialidad"
              />
            </div>

            <div className="w-full mb-4">
              <label
                htmlFor="duracion"
                className="block text-sm font-medium text-gray-700"
              >
                Duración (en semestres)
              </label>
              <input
                type="number"
                id="duracion"
                name="duracion"
                value={formData.duracion}
                min={1}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                placeholder="Ingrese la duración en semestres"
              />
            </div>

            <div className="flex-col">
              <div className="">
                <button
                  type="submit"
                  className="w-full bg-royalBlue text-white py-2 px-4 rounded-md hover:bg-royalBlue-dark transition duration-150 my-1"
                >
                  Actualizar Especialidad
                </button>
              </div>
              <div className="">
                <a
                  className="w-full block bg-emeraldGreen text-white py-2 px-4 rounded-md hover:bg-emeraldGreen-dark transition duration-150 my-1 text-center"
                  href="/especialidades"
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
