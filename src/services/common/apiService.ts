import Login from "@/app/auth/login/page";
import axios from "axios";
import { signIn } from "next-auth/react";
import Swal from "sweetalert2";

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
  token,
}: {
  entidad: string;
  search?: string;
  page?: number;
  limit?: number;
  filter?: Record<string, string>;
  token?: string;
}) => {
  try {
    const response = await apiClient.get(`${entidad}`, {
      params: { search, page, limit, ...filter },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: any) {
    // Verificar si es un error de Axios
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || 'Algo salió mal. Inténtalo nuevamente.';
      const errorStatus = err.response?.status || 'Error';

      // Mostrar alerta personalizada
      Swal.fire({
        title: `Ups, ocurrió un error (${errorStatus})`,
        text: errorMessage,
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3085d6', // Color más amigable y accesible
        background: '#fefefe',
        color: '#333',
        timer:3000,
        timerProgressBar:true,
        focusCancel:true,
        padding: '1.5em',
        customClass: {
          popup: 'rounded-lg shadow-md',
          title: 'text-lg font-semibold text-gray-800',
          htmlContainer: 'text-sm text-gray-600',
          confirmButton: 'px-4 py-2 rounded-md bg-royalBlue text-white hover:bg-royalBlue-dark transition duration-200',
          cancelButton: 'px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-200',
        },
      }).then(
        (result) => {
          signIn
        }
      );
    } else {
      // Alerta para otros tipos de errores inesperados
      Swal.fire({
        title: 'Error inesperado',
        text: 'Algo salió mal. Por favor, vuelve a intentarlo.',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#d33', // Rojo para denotar error inesperado
        background: '#fff8f0',
        color: '#333',
        focusCancel:true,
        padding: '1.5em',
        customClass: {
          popup: 'rounded-lg shadow-md',
          title: 'text-lg font-semibold text-gray-800',
          htmlContainer: 'text-sm text-gray-600',
          confirmButton: 'px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-200',
        },
      });
    }
  }
};



export const fetchEntidad = async ({
  entidad,
  id,
  token
}: {
  entidad: string;
  id: string;
  token?:string
}) => {
  try {
    const response = await apiClient.get(`${entidad}/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);

    return response;
  } catch (err) {
    console.log(`Error al obtener la entidad ${err} `);
  }
};

export const desactivarEntidad = async ({
  entidad,
  id,
  token,
}: {
  entidad: string;
  id: string;
  token?: string;
}) => {
  try {
    const response = await apiClient.put(`${entidad}/${id}`,null,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
  token,
}: {
  entidad: string;
  data: Record<string, any>;
  token?: string;
}) => {
  try {
    const response = await apiClient.post(`${entidad}`, data,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.log(`Error al crear la entidad ${err} `);
  }
};

export const editarEntidad = async ({
  entidad,
  data,
  id,
  token,
}: {
  entidad: string;
  data: Record<string, any>;
  id: string;
  token?: string;
}) => {
  try {
    const response = await apiClient.patch(`${entidad}/${id}`, data,{
      headers: {
        Authorization: `Bearer ${token}`
        }
    });
    return response.data;
  } catch (err) {
    console.log(`Error al crear la entidad ${err} `);
  }
};
