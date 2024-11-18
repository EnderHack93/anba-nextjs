import axios from "axios";

const url_base = process.env.NEXT_PUBLIC_URL_BACKEND;

const apiClient = axios.create({
  baseURL: url_base,
});

export const recoverPassword = async (email: string) => {
  try {
    const response = await apiClient.post("/auth/recover-password", {
      correo: email,
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const resetPassword = async (token: any, password: string) => {
  try {
    const response = await apiClient.post(
      "/auth/reset-password",
      {
        newPassword: password,
      },
      {
        params: {
          token: token,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
