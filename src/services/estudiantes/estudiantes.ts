import axios from "axios";

const url_base = process.env.NEXT_PUBLIC_URL_BACKEND;

const apiClient = axios.create({
  baseURL: url_base,
});

export const fetchEstudiantesNoInscritosMateria = async (id_materia:Number,token?:string) => {
  try {
    const response = await apiClient.get(`/estudiantes/noInscritos?id_materia=${id_materia}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
}