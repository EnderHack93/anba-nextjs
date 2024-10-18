import { Especialidad } from "./especialidad";
import { Semestre } from "./semestre";

export interface Materia {
  id_materia: number
  nombre: string;
  descripcion: string;
  semestre: Semestre;
  estado: string;
  especialidad:Especialidad
}
