export interface Estudiante{
  id_estudiante:string
  nombres:string
  apellidos:string
  correo:string
  img_perfil:string
  telefono?:string
  estado:string
  carnet:string
  especialidad:{
    id_especialidad:number
    nombre:string

  }
  
}