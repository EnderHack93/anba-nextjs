import { Estado } from "./estado";

export interface Administrador {
  id_admin: string;
  nombres: string;
  apellidos: string;
  telefono?: string;
  correo: string;
  img_perfil: string;
  estado: Estado;
  carnet: string;
}
