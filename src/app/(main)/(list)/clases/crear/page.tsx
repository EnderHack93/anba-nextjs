"use client";
import { Title } from "@/components";
import { Docente } from "@/interfaces/entidades/docente";
import { Materia } from "@/interfaces/entidades/materia";
import { crearEntidad, fetchEntidades } from "@/services/apiService";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function crearClase() {
  const [formData, setFormData] = useState({
    nombre: "",
    capacidad_max: Number(10),
    horario: "",
    aula: "",
    gestion: "",
    id_materia: Number(0),
    id_docente: Number(0),
  });

  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [filteredDocentes, setFilteredDocentes] = useState<Docente[]>([]); // Docentes filtrados por materia
  const [isDocenteSelectEnabled, setIsDocenteSelectEnabled] = useState(false); // Para controlar si el select de docentes está habilitado

  const fetchDocentes = async () => {
    try {
      const response = await fetchEntidades({ entidad: "docentes" });
      setDocentes(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMaterias = async () => {
    try {
      const response = await fetchEntidades({ entidad: "materias" });
      setMaterias(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Cuando se selecciona una materia, filtramos los docentes
    if (name === "id_materia") {
      const selectedMateria = materias.find(
        (materia) => materia.id_materia === Number(value)
      );

      // Si se selecciona una materia válida, habilitamos el select de docentes y filtramos los docentes
      if (selectedMateria) {
        setFilteredDocentes(
          docentes.filter(
            (docente) =>
              docente.especialidad.id_especialidad ===
              selectedMateria.especialidad.id_especialidad
          )
        );
        setIsDocenteSelectEnabled(true); // Habilitamos el select de docentes
      } else {
        setFilteredDocentes([]); // Si no se selecciona ninguna materia, reseteamos los docentes filtrados
        setIsDocenteSelectEnabled(false); // Deshabilitamos el select de docentes
      }
    }

    setFormData({
      ...formData,
      [name]:
        name === "id_materia" || name === "capacidad_max"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { ...submitValues } = formData;

    try {
      const response = await crearEntidad({
        entidad: "clases",
        data: submitValues,
      });

      Swal.fire({
        icon: "success",
        title: "Creado",
        text: "Se ha creado la clase",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        window.location.href = "/clases";
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDocentes();
    fetchMaterias();
  }, []);

  return (
    <>
      <div className="bg-white rounded-md p-2 mt-4 flex-1 shadow-2xl">
        <Title title="Crear Clase" className="flex md:justify-center pt-4" />
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg max-w-md md:max-w-lg mt-5 mb-5 mx-auto"
        >
          <div className="md:flex w-full md:gap-2 justify-center">
            <div className="w-full mb-4">
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700"
              >
                Nombres *
              </label>
              <input
                required
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                placeholder="Ingrese los nombres"
              />
            </div>

            <div className="w-full mb-4">
              <label
                htmlFor="capacidad_max"
                className="block text-sm font-medium text-gray-700"
              >
                Capacidad *
              </label>
              <input
                required
                type="number"
                id="capacidad_max"
                name="capacidad_max"
                value={formData.capacidad_max}
                min={10}
                max={35}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                placeholder="Ingrese la capacidad máxima"
              />
            </div>
          </div>

          <div className="md:flex w-full md:gap-2 justify-center">
            <div className="w-full mb-4">
              <label
                htmlFor="horario"
                className="block text-sm font-medium text-gray-700"
              >
                Horario *
              </label>
              <select
                required
                id="horario"
                name="horario"
                value={formData.horario}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
              >
                <option disabled value="">
                  -- Seleccione --
                </option>

                <option value="7:30 - 9:10">7:30 - 9:10</option>
                <option value="9:20 - 11:00">9:20 - 11:00</option>
                <option value="11:10 - 12:50">11:10 - 12:50</option>
                <option value="13:00 - 14:40">13:00 - 14:40</option>
                <option value="14:50 - 16:30">14:50 - 16:30</option>
                <option value="16:40 - 18:20">16:40 - 18:20</option>
                <option value="18:30 - 20:10">18:30 - 20:10</option>
                <option value="20:20 - 22:00">20:20 - 22:00</option>
              </select>
            </div>

            <div className="w-full mb-4">
              <label
                htmlFor="aula"
                className="block text-sm font-medium text-gray-700"
              >
                Aula
              </label>
              <input
                required
                type="text"
                id="aula"
                name="aula"
                value={formData.aula}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
                placeholder="Ingrese el aula"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="id_materia"
              className="block text-sm font-medium text-gray-700"
            >
              Materia *
            </label>
            <select
              required
              id="id_materia"
              name="id_materia"
              value={formData.id_materia}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm"
            >
              <option value="">Seleccione una materia</option>
              {materias.map((materia) => (
                <option key={materia.id_materia} value={materia.id_materia}>
                  {materia.nombre} - {materia.semestre}º Semestre
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="id_docente"
              className="block text-sm font-medium text-gray-700"
            >
              Docente *
            </label>
            <select
              required
              id="id_docente"
              name="id_docente"
              value={formData.id_docente}
              onChange={handleChange}
              disabled={!isDocenteSelectEnabled} // El select estará deshabilitado hasta que se seleccione una materia
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-royalBlue sm:text-sm ${
                !isDocenteSelectEnabled ? "bg-gray-200" : ""
              }`} // Si está deshabilitado, le agregamos un fondo gris
            >
              <option value="">Seleccione un docente</option>
              {filteredDocentes.map((docente) => (
                <option key={docente.id_docente} value={docente.id_docente}>
                  {docente.nombres} - {docente.especialidad.nombre}
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
                href={"/clases"}
              >
                Volver
              </a>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
