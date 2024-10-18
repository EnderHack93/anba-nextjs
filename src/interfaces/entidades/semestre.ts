import { Estado } from "./estado"

export interface Semestre{
    id_semestre:number
    nombre:string
    gestion:string
    estado:Estado
}