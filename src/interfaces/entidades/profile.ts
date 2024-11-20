import { Administrador } from "./administrador";
import { Docente } from "./docente";
import { Estado } from "./estado";
import { Estudiante } from "./estudiante";
import { Usuario } from "./usuario";

export interface ProfileUser<T>{
    usuario: Usuario;
    info:T

}