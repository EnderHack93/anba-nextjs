import axios from "axios";

const url_base = process.env.NEXT_PUBLIC_URL_BACKEND;

const apiClient = axios.create({
  baseURL: url_base,
});

/**
 * Realiza una llamada para obtener predicciones de estudiantes.
 * @param {Record<string, string>} filters - Filtros dinámicos para la consulta.
 * @returns {Promise<any>} - Datos de predicción.
 */
export const fetchPrediction = async ({
  filter = {},
}: {
  filter?: Record<string, string>;
}) => {
  try {

    const response = await apiClient.get(
      `/cuadro-de-mando/estadoEstudiantes`, {
        params: {...filter},
      }
    );

    return response.data;
  } catch (err) {
    console.error("Error fetching predictions:", err);
    throw err;
  }
};

export const fetchCrecimientoEstudiantes = async (token: string) => {
  const response = await apiClient.get(`/cuadro-de-mando/crecimientoEstudiantes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAsistenciaData = async (token: string) => {
  const startDate = new Date('2024/09/01').toISOString().slice(0, 10);
  const endDate = new Date('2024/11/21').toISOString().slice(0, 10);
  const response = await apiClient.get(`/cuadro-de-mando/asistencia/fecha`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },params: {
      startDate,
      endDate,
    },
  });
  return response.data;
};

export const fetchRendimientoData = async (token: string) => {
  const response = await apiClient.get(`cuadro-de-mando/rendimiento/general`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

  });
  return response.data;
};
