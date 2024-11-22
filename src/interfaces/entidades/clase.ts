import { Docente } from "./docente";
import { Estado } from "./estado";
import { Materia } from "./materia";

export interface Clase {
  id_clase: number;
  nombre: string;
  capacidad_max: number;
  dias: string[];
  horario: string;
  horaInicio: string;
  horaFin: string;
  aula: string;
  estado: Estado;
  materia:Materia
  docente:Docente
}
