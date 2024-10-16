"use server";
import { response } from "@/interfaces/responses/common_paginate_response";
import axios from "axios";

const url_base = process.env.URL_BACKEND;

export const fetchEntidades = async ({ entidad }: { entidad: string }) => {
  const response = await axios.get(`${url_base}${entidad}`);
  const data: response = response.data;
  return data;
};

export const desactivarEntidad = async (
  id: string,
  entidad: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${url_base}${entidad}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Error al desactivar el estudiante");
    }
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};
