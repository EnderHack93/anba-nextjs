import axios from "axios";

const url_base = process.env.NEXT_PUBLIC_URL_BACKEND;

const apiClient = axios.create({
  baseURL: url_base,
});

export const loginUser = async (data: any) => {
  try {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}