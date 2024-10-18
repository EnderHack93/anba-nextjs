"use client";
import { Title } from "@/components";
import { crearEntidad } from "@/services/common/apiService";
import { useState } from "react";
import Swal from "sweetalert2";

export default function CrearEspecialidad() {
  const [formData, setFormData] = useState({
    nombre: "",
    duracion: 8,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "duracion" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await crearEntidad({
        entidad: "especialidades",
        data: formData,
      });

      Swal.fire({
        icon: "success",
        title: "Creado",
        text: "Se ha creado la especialidad",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        window.location.href = "/especialidades";
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear la especialidad",
      });
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 mt-0 shadow-2xl">
        <div className="justify-center flex-col">
          <Title title="Crear Especialidad" className="flex md:justify-center" />
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg  max-w-md md:max-w-lg mt-5 mb-5 mx-auto"
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
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                placeholder="Ingrese la duración en semestres (opcional)"
              />
            </div>

            <div className="flex-col">
              <div className="">
                <button
                  type="submit"
                  className="w-full bg-royalBlue text-white py-2 px-4 rounded-md hover:bg-royalBlue-dark transition duration-150 my-1"
                >
                  Registrar Especialidad
                </button>
              </div>
              <div className="">
                <a
                  className="w-full block bg-emeraldGreen text-white py-2 px-4 rounded-md hover:bg-emeraldGreen-dark transition duration-150 my-1 text-center"
                  href={"/especialidades"}
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
