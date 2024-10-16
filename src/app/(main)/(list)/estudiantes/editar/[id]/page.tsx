"use client";
import { Title } from "@/components";
import { Especialidad } from "@/interfaces/entidades/especialidad";
import {
  crearEntidad,
  editarEntidad,
  fetchEntidad,
  fetchEntidades,
} from "@/services/apiService";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function EditarEstudiante({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const idEstudiante = params.id;

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    carnet: "",
    correo: "",
    telefono: "",
    fecha_nacimiento: "",
    id_especialidad: 0,
  });

  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [originalData, setOriginalData] = useState({
    nombres: "",
    apellidos: "",
    carnet: "",
    correo: "",
    telefono: "",
    fecha_nacimiento: "",
    id_especialidad: 0,
  });

  const fetchEspecialidades = async () => {
    try {
      const response = await fetchEntidades({ entidad: "especialidades" });
      setEspecialidades(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchEstudiante = async (id: string) => {
    try {
      const response = await fetchEntidad({ entidad: "estudiantes", id });

      if (response && response.data) {
        setFormData({
          nombres: response.data.nombres || "",
          apellidos: response.data.apellidos || "",
          carnet: response.data.carnet || "",
          correo: response.data.correo || "",
          telefono: response.data.telefono || "",
          fecha_nacimiento: response.data.fecha_nacimiento.split("T")[0] || "",
          id_especialidad: response.data.especialidad.id_especialidad || 0,
        });

        setOriginalData({
          nombres: response.data.nombres || "",
          apellidos: response.data.apellidos || "",
          carnet: response.data.carnet || "",
          correo: response.data.correo || "",
          telefono: response.data.telefono || "",
          fecha_nacimiento: response.data.fecha_nacimiento.split("T")[0] || "",
          id_especialidad: response.data.especialidad.id_especialidad || 0,
        });
        setImagePreview(response.data.img_perfil || "");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener la información del estudiante",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.href = "/estudiante";
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // Crear URL temporal para previsualización
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

  const getModifiedData = () => {
    const modifiedData: Partial<any> = {};

    // Comparamos solo si originalData no es null
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
      const response = await editarEntidad({
        entidad: "estudiantes",
        data: modifiedData,
        id: idEstudiante,
      }).then(() => {
        Swal.fire({
          icon: "success",
          title: "Editado",
          text: "Se ha editado el estudiante",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.href = "/estudiantes";
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEstudiante(idEstudiante);
    fetchEspecialidades();
  }, []);

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 shadow-2xl mt-8">
        <div className="justify-center flex-col">
          <Title title="Editar Estudiante" className="flex md:justify-center" />
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg max-w-4xl mt-5 mb-5 sm:flex sm:items-center sm:gap-6 mx-auto"
          >
            <div className="mb-4 flex flex-col items-center w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Foto de Perfil
              </label>
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Imagen de perfil"
                  className="h-w-56 w-56 object-cover rounded-full"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2"
              />
            </div>
            <div className="w-full">
              <div className="md:flex w-full md:gap-2 justify-center">
                <div className="w-full mb-4">
                  <label
                    htmlFor="nombres"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombres
                  </label>
                  <input
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
                    Apellidos
                  </label>
                  <input
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
                    Carnet
                  </label>
                  <input
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
                    Correo
                  </label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                    placeholder="Ingrese su direccion de correo"
                  />
                </div>
              </div>

              <div className="md:flex w-full md:gap-2 justify-center">
                <div className="w-full mb-4">
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Telefono
                  </label>
                  <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                    placeholder="Ingrese su numero de telefono"
                  />
                </div>

                <div className="w-full mb-4">
                  <label
                    htmlFor="fecha_nacimiento"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    id="fecha_nacimiento"
                    name="fecha_nacimiento"
                    min={new Date("1900-01-01").toISOString().split("T")[0]}
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                  />
                </div>
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
                    href={"/docentes"}
                  >
                    Volver
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
