import { Docente } from "./docente";
import { Materia } from "./materia";

export interface Clase {
  id_clase: number;
  nombre: string;
  capacidad_max: number;
  horario: string;
  aula: string;
  gestion: string;
  estado: string;
  materia:Materia
  docente:Docente
}
