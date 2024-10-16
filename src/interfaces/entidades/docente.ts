export interface Docente{
  id_docente:string
  nombres:string
  apellidos:string
  correo:string
  estado:string
  carnet:string
  especialidad:{
    id_especialidad:number
    nombre:string

  }
  
}