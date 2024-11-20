import { Especialidad } from "./especialidad"
import { Estado } from "./estado"

export interface Docente{
  id_docente:string
  nombres:string
  apellidos:string
  correo:string
  img_perfil:string
  estado:Estado
  carnet:string
  especialidad:Especialidad
  
}