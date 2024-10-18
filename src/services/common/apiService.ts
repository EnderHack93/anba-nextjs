import axios from "axios";

const url_base = process.env.NEXT_PUBLIC_URL_BACKEND;

const apiClient = axios.create({
  baseURL: url_base,
});

export const fetchEntidades = async ({
  entidad,
  search,
  page,
  limit,
  filter = {},
}: {
  entidad: string;
  search?: string;
  page?: number;
  limit?: number;
  filter?: Record<string, string>;
}) => {
  try {
    const response = await apiClient.get(`${entidad}`, {
      params: { search, page, limit, ...filter },
    });
    return response.data;
  } catch (err) {
    console.log(`Error al obtener la entidad ${entidad} `);
  }
};

export const fetchEntidad = async ({
  entidad,
  id,
}: {
  entidad: string;
  id: string;
}) => {
  try {
    const response = await apiClient.get(`${entidad}/${id}`);
    console.log(response);

    return response;
  } catch (err) {
    console.log(`Error al obtener la entidad ${err} `);
  }
};

export const desactivarEntidad = async ({
  entidad,
  id,
}: {
  entidad: string;
  id: string;
}) => {
  try {
    const response = await apiClient.put(`${entidad}/${id}`);
    return response.data;
  } catch (err) {
    console.log(`Error al desactivar la entidad ${entidad} `);
  }
};

export const eliminarEntidad = async ({
  entidad,
  id,
}: {
  entidad: string;
  id: string;
}) => {
  try {
    const response = await apiClient.delete(`${entidad}/${id}`);
    return response.data;
  } catch (err) {
    console.log(`Error al eliminar la ${err} `);
  }
};

export const crearEntidad = async ({
  entidad,
  data,
}: {
  entidad: string;
  data: Record<string, any>;
}) => {
  try {
    const response = await apiClient.post(`${entidad}`, data);
    return response.data;
  } catch (err) {
    console.log(`Error al crear la entidad ${err} `);
  }
};

export const editarEntidad = async ({
  entidad,
  data,
  id,
}: {
  entidad: string;
  data: Record<string, any>;
  id: string;
}) => {
  try {
    const response = await apiClient.patch(`${entidad}/${id}`, data);
    return response.data;
  } catch (err) {
    console.log(`Error al crear la entidad ${err} `);
  }
};
