import { Estado } from "./estado";

export interface Usuario {
  id_usuario: number;
  username: string;
  email: string;
  rol: string;
  estado: Estado;
}
