import { Estado } from "./estado";

export interface Administrador {
  id_administrador: number;
  nombres: string;
  apellidos: string;
  correo: string;
  img_perfil: string;
  estado: Estado;
  carnet: string;
}
