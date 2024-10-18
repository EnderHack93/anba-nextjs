import axios from "axios";

const url_base = process.env.NEXT_PUBLIC_URL_BACKEND;

const apiClient = axios.create({
  baseURL: url_base,
});

export const fetchNoInscritosMateria = async () => {
  try {
    const response = await apiClient.get("/clases");
    return response.data;
  } catch (err) {
    console.log(err);
  }
}