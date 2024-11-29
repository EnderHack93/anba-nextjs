import { Especialidad } from "./especialidad";
import { Estado } from "./estado";
import { Semestre } from "./semestre";

export interface Materia {
  id_materia: number
  nombre: string;
  descripcion: string;
  semestre: Semestre;
  estado: Estado;
  especialidad:Especialidad
}
