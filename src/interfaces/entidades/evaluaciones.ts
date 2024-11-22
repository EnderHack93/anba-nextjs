import { Clase } from "./clase";
import { Estudiante } from "./estudiante";

export interface Evaluaciones{
    id_evaluacion: number;
    clase:Clase;
    estudiante:Estudiante;
    nota:number;
}