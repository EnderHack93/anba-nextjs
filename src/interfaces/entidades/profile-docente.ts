import { Docente } from "./docente";
import { Estado } from "./estado";

export interface ProfileUser extends Docente{
    usuario:{
        id:string
        username:string
        rol:string
        email:string
        estado:Estado
        
    }
}