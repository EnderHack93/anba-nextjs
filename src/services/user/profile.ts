import axios from "axios";

const url_base = process.env.NEXT_PUBLIC_URL_BACKEND;

const apiClient = axios.create({
  baseURL: url_base,
});

export const fetchProfileInfo = async (token:string) => {
  try {
    const response = await apiClient.get(`/usuarios/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}