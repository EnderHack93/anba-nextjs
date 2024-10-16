import { Clase } from "./clase"
import { Estudiante } from "./estudiante"

export interface Inscrito {
    id_inscrito: number
    estudiante:Estudiante
    fecha_inscripcion:Date
    clase:Clase
    estado: string
}