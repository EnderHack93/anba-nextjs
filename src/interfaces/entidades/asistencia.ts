import { Clase } from "./clase"
import { Estudiante } from "./estudiante"

export interface Asistencia{
    id_asistencia:number
    clase:Clase
    estudiante:Estudiante
    fecha:Date
    asistio:string
}