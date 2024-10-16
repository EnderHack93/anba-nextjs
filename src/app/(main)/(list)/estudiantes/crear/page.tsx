"use client";
import { Title } from "@/components";
import { Especialidad } from "@/interfaces/entidades/especialidad";
import { crearEntidad, fetchEntidades } from "@/services/apiService";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function CrearEstudiante() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    carnet: "",
    correo: "",
    telefono: "",
    fecha_nacimiento: "",
    password: "",
    confirmPassword: "",
    id_especialidad: Number(0),
  });

  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordInvalid, setPasswordInvalid] = useState<string | null>(null);

  const fetchEspecialidades = async () => {
    try {
      const response = await fetchEntidades({ entidad: "especialidades" });
      setEspecialidades(response.data);
    } catch (err) {
      console.log(err);
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

    if (name === "password") {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
      const validate = passwordRegex.test(formData.password);

      if (!validate) {
        setPasswordInvalid(
          "La contraseña debe incluir almenos 8 caracteres, una mayuscula, un numero y un caracter especial"
        );
      } else {
        setPasswordInvalid(null);
      }
    }

    if (name === "confirmPassword" || name === "password") {
      if (name === "confirmPassword" && value !== formData.password) {
        setPasswordError("Las contraseñas no coinciden.");
      } else if (
        name === "password" &&
        value !== confirmPassword &&
        confirmPassword !== ""
      ) {
        setPasswordError("Las contraseñas no coinciden.");
      } else {
        setPasswordError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { confirmPassword, ...submitValues } = formData;
    console.log(submitValues)

    try{
      const response = await crearEntidad({
        entidad: "estudiantes",
        data: submitValues
      })

      Swal.fire({
        icon: "success",
        title: "Creado",
        text: "Se ha creado el estudiante",
        showConfirmButton: false,
        timer: 1000,
      }).then(
        () => {
          window.location.href = "/estudiantes";
        }
      )
    }
    catch(err){
      console.log(err)
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 mt-0 shadow-2xl">
        <div className="justify-center flex-col">
          <Title title="Crear Estudiante" className="flex md:justify-center" />
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg  max-w-md
          md:max-w-lg mt-5 mb-5  mx-auto"
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
                  Fecha de Nacimiento *
                </label>
                <input
                  required
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  min={new Date("1900-01-01").toISOString().split("T")[0]}
                  max={new Date("2000-01-01").toISOString().split("T")[0]}
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña *
              </label>
              <input
                required
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm ${
                  passwordInvalid ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                  passwordInvalid
                    ? "focus:ring-red-500"
                    : "focus:ring-royalBlue"
                } sm:text-sm`}
                placeholder="Ingrese su contraseña"
              />
            </div>
            {passwordInvalid && (
              <p className="text-red-500 text-sm mb-4">{passwordInvalid}</p>
            )}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirma tu contraseña *
              </label>
              <input
                required
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  passwordError ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                  passwordError ? "focus:ring-red-500" : "focus:ring-royalBlue"
                } sm:text-sm`}
                placeholder="Repita su contraseña"
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mb-4">{passwordError}</p>
            )}

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
                  href={"/estudiantes"}
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
