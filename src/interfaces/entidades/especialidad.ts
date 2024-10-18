import { Estado } from "./estado";

export interface Especialidad {
  id_especialidad: number;
  nombre: string;
  duracion: number;
  estado: Estado;
}
