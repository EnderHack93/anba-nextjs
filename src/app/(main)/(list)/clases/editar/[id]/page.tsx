"use client";
import { Title } from "@/components";
import LoadingScreen from "@/components/ui/loading-page/page";
import UnauthorizedScreen from "@/components/ui/unautorized/page";
import { Docente } from "@/interfaces/entidades/docente";
import { Materia } from "@/interfaces/entidades/materia";
import {
  editarEntidad,
  fetchEntidad,
  fetchEntidades,
} from "@/services/common/apiService";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function EditarClase({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const idClase = params.id;

  const [formData, setFormData] = useState({
    nombre: "",
    capacidad_max: Number(),
    horario: "",
    aula: "",
    id_materia: Number(0),
    id_docente: "",
    dias: [] as string[], // Nuevo campo para los días
  });

  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [filteredDocentes, setFilteredDocentes] = useState<Docente[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [isDocenteSelectEnabled, setIsDocenteSelectEnabled] = useState(false);
  const { data: session, status } = useSession();
  const [originalData, setOriginalData] = useState({
    nombre: "",
    capacidad_max: Number(),
    horario: "",
    aula: "",
    id_materia: Number(0),
    id_docente: "",
    dias: [] as string[], // Campo original para comparación
  });

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ]; // Lista de días para el select

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

  const fetchClase = async (id: string) => {
    try {
      const response = await fetchEntidad({ entidad: "clases", id });

      if (response && response.data) {
        setFormData({
          nombre: response.data.nombre || "",
          capacidad_max: response.data.capacidad_max || 0,
          horario: response.data.horario || "",
          aula: response.data.aula || "",
          id_materia: response.data.materia.id_materia || 0,
          id_docente: response.data.docente.id_docente || "",
          dias: response.data.dias || [], // Asignar días desde la API
        });

        setOriginalData({
          nombre: response.data.nombre || "",
          capacidad_max: response.data.capacidad_max || 0,
          horario: response.data.horario || "",
          aula: response.data.aula || "",
          id_materia: response.data.materia.id_materia || 0,
          id_docente: response.data.docente.id_docente || "",
          dias: response.data.dias || [], // Guardar días originales
        });

        const selectedMateria = response.data.materia;
        const filtered = docentes.filter(
          (docente) =>
            docente.especialidad.id_especialidad ===
            selectedMateria.id_especialidad
        );
        setFilteredDocentes(filtered);
        setIsDocenteSelectEnabled(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener la información de la clase",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.href = "/clases";
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "id_materia") {
      const selectedMateria = materias.find(
        (materia) => materia.id_materia === Number(value)
      );

      if (selectedMateria) {
        const filtered = docentes.filter(
          (docente) =>
            docente.especialidad.id_especialidad ===
            selectedMateria.especialidad.id_especialidad
        );
        setFilteredDocentes(filtered);
        setIsDocenteSelectEnabled(true);
      } else {
        setFilteredDocentes([]);
        setIsDocenteSelectEnabled(false);
      }
    }

    setFormData({
      ...formData,
      [name]: name === "id_materia" ? Number(value) : value,
    });
  };

  const handleDaysChange = (day: string) => {
    const updatedDays = formData.dias.includes(day)
      ? formData.dias.filter((d) => d !== day)
      : [...formData.dias, day];

    setFormData({
      ...formData,
      dias: updatedDays,
    });
  };

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
        entidad: "clases",
        data: modifiedData,
        id: idClase,
      });
      Swal.fire({
        icon: "success",
        title: "Editado",
        text: "Se ha editado la clase",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        //window.location.href = "/clases";
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchClase(idClase);
      fetchDocentes();
      fetchMaterias();
    }
  }, [status]);

  if (status === "loading") return <LoadingScreen />;
  if (status === "unauthenticated" || session?.user.rol !== "ADMIN")
    return <UnauthorizedScreen />;

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 mt-4 shadow-2xl">
        <div className="justify-center flex-col">
          <Title title="Editar Clases" className="flex md:justify-center" />
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            {/* Días de la semana */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {diasSemana.map((dia) => (
                  <label key={dia} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="dias"
                      value={dia}
                      checked={formData.dias.includes(dia)}
                      onChange={() => handleDaysChange(dia)}
                      className="rounded border-gray-300 focus:ring-2 focus:ring-royalBlue"
                    />
                    <span className="text-sm text-gray-700">{dia}</span>
                  </label>
                ))}
              </div>
            </div>

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
                <option disabled value="">
                  Seleccione una materia
                </option>
                {materias.map((materia) => (
                  <option key={materia.id_materia} value={materia.id_materia}>
                    {materia.nombre} - {materia.semestre.gestion}º Semestre
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
                  Editar
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
      </div>
    </>
  );
}
