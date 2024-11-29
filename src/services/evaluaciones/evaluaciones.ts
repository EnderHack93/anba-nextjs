import axios from "axios";

const url_base = process.env.NEXT_PUBLIC_URL_BACKEND;

const apiClient = axios.create({
  baseURL: url_base,
});

export const initRegistrosByIdClase = async (
  id_clase: number,
  tipo_evaluacion: string,
  token?: string
) => {
  try {
    const response = await apiClient.post(
      `/evaluaciones/iniciarRegistros`,
      {
        id_clase,
        tipo_evaluacion,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const confirmarNotas = async (
  id_clase: number,
  tipo_evaluacion: string,
  token?: string
) => {
  try {
    const response = await apiClient.post(
      `/evaluaciones/confirmarEvaluacion`,
      {
        id_clase,
        tipo_evaluacion,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const changeScoreEvaluacion = async (
  id_evaluacion: number,
  nuevaNota: number,
  token?: string
) => {
  try {
    const response = await apiClient.post(
      `/evaluaciones/changeScore`,
      {
        id_evaluacion,
        nuevaNota,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
