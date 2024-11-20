import { Especialidad } from "./especialidad"
import { Estado } from "./estado"

export interface Estudiante{
  id_estudiante:string
  nombres:string
  apellidos:string
  correo:string
  img_perfil:string
  telefono?:string
  estado:Estado
  carnet:string
  especialidad:Especialidad
  
}