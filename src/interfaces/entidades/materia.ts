import { Especialidad } from "./especialidad";

export interface Materia {
  id_materia: number
  nombre: string;
  descripcion: string;
  semestre: string;
  estado: string;
  especialidad:Especialidad
}
