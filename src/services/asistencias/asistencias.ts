import axios from "axios";

const url_base = process.env.NEXT_PUBLIC_URL_BACKEND;

const apiClient = axios.create({
  baseURL: url_base,
});


export const getAsistenciasByClaseAndDate = async (id_clase:Number,fecha:string,token?:string) => {
    try {
      const response = await apiClient.get(`/asistencias`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          'filter.clase.id_clase':id_clase,
          'filter.fecha':fecha
        }
      });
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

export const CreateAsistenciasByClase = async (id_clase:number,fecha:string,token?:string,) => {
  try {
    const response = await apiClient.post(`/asistencias/iniciarRegistroAsistencia`,{
      fecha,
      id_clase,
    },{
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
}