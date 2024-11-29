import { Clase } from "./clase";
import { Estado } from "./estado";
import { Estudiante } from "./estudiante";

export interface Evaluaciones{
    id_evaluacion: number;
    clase:Clase;
    estudiante:Estudiante;
    nota:number;
    estado:Estado
}