import axios from "axios";

const url_base = process.env.NEXT_PUBLIC_URL_BACKEND;

const apiClient = axios.create({
  baseURL: url_base,
});
export const fetchPrediction = async (data: any): Promise<any> => {
    try {
      const response = await apiClient.post("/cuadro-de-mando/predict", data);

      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  