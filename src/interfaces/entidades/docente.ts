import { Especialidad } from "./especialidad"

export interface Docente{
  id_docente:string
  nombres:string
  apellidos:string
  correo:string
  img_perfil:string
  estado:string
  carnet:string
  especialidad:Especialidad
  
}