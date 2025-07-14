import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

export interface Muestreo {
  id_muestreo: number
  fecha_muestreo: string
  observaciones: string
  id_salida_campo: number
  id_cuerpo_agua: number
  id_tecnico: number
}

export interface MuestreoCreate {
  fecha_muestreo: string
  observaciones: string
  id_salida_campo: number
  id_cuerpo_agua: number
  id_tecnico: number
}

export interface MuestreoUpdate {
  observaciones?: string
  id_salida_campo?: number
  id_cuerpo_agua?: number
  id_tecnico?: number
}

export async function listMuestreos(): Promise<Muestreo[]> {
  const response = await axios.get(`${API_URL}/muestreos`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function getMuestreoById(id: number): Promise<Muestreo> {
  const response = await axios.get(`${API_URL}/muestreos/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function createMuestreo(data: MuestreoCreate): Promise<Muestreo> {
  const response = await axios.post(`${API_URL}/muestreos`, data, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function updateMuestreo(id: number, data: MuestreoUpdate): Promise<Muestreo> {
  const response = await axios.patch(`${API_URL}/muestreos/${id}`, data, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function deleteMuestreo(id: number): Promise<void> {
  await axios.delete(`${API_URL}/muestreos/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
}