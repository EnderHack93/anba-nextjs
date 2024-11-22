"use client";
import { Title } from "@/components";
import { crearEntidad } from "@/services/common/apiService";
import { useState } from "react";
import Swal from "sweetalert2";

export default function CrearAdministrador() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    carnet: "",
    correo: "",
    telefono: "",
    fecha_nacimiento: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitValues = formData;

    try {
      const response = await crearEntidad({
        entidad: "administradores",
        data: submitValues,
      });
      console.log(response);

      Swal.fire({
        icon: "success",
        title: "Creado",
        text: "Se ha creado el administrador exitosamente.",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        window.location.href = "/administradores";
      });
    } catch (err) {
      console.error("Error al crear administrador:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el administrador. Intenta nuevamente.",
      });
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 mt-0 shadow-2xl">
        <div className="justify-center flex-col">
          <Title
            title="Crear Administrador"
            className="flex md:justify-center"
          />
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg max-w-md md:max-w-lg mt-5 mb-5 mx-auto"
          >
            <div className="md:flex w-full md:gap-2 justify-center">
              <div className="w-full mb-4">
                <label
                  htmlFor="nombres"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombres *
                </label>
                <input
                  required
                  type="text"
                  id="nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                  placeholder="Ingrese sus nombres"
                />
              </div>

              <div className="w-full mb-4">
                <label
                  htmlFor="apellidos"
                  className="block text-sm font-medium text-gray-700"
                >
                  Apellidos *
                </label>
                <input
                  required
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                  placeholder="Ingrese sus apellidos"
                />
              </div>
            </div>

            <div className="md:flex w-full md:gap-2 justify-center">
              <div className="w-full mb-4">
                <label
                  htmlFor="carnet"
                  className="block text-sm font-medium text-gray-700"
                >
                  Carnet *
                </label>
                <input
                  required
                  type="text"
                  id="carnet"
                  name="carnet"
                  value={formData.carnet}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                  placeholder="Ingrese su carnet de identidad"
                />
              </div>

              <div className="w-full mb-4">
                <label
                  htmlFor="correo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo *
                </label>
                <input
                  required
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                  placeholder="Ingrese su dirección de correo"
                />
              </div>
            </div>

            <div className="md:flex w-full md:gap-2 justify-center">
              <div className="w-full mb-4">
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-gray-700"
                >
                  Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                  placeholder="Ingrese su número de teléfono"
                />
              </div>

              <div className="w-full mb-4">
                <label
                  htmlFor="fecha_nacimiento"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha de Nacimiento *
                </label>
                <input
                  required
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  min={new Date("1900-01-01").toISOString().split("T")[0]}
                  max={new Date().toISOString().split("T")[0]}
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                />
              </div>
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
                  href={"/administradores"}
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
