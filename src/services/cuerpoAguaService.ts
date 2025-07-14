import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

export interface CuerpoAgua {
  id_cuerpo_agua: number
  nombre: string
  descripcion: string
  tipo: string
  latitud: number
  longitud: number
  ubicacion_descripcion: string
  fecha_registro: string
  id_comunidad: number
}

export interface CuerpoAguaCreate {
  nombre: string
  descripcion: string
  tipo: string
  latitud: number
  longitud: number
  ubicacion_descripcion: string
  fecha_registro: string
  id_comunidad: number
}

export interface CuerpoAguaUpdate {
  nombre?: string
  descripcion?: string
  tipo?: string
  latitud?: number
  longitud?: number
  ubicacion_descripcion?: string
  fecha_registro?: string
  id_comunidad?: number
}

export async function listCuerposAgua(): Promise<CuerpoAgua[]> {
  const response = await axios.get(`${API_URL}/cuerpos-agua`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function getCuerpoAguaById(id: number): Promise<CuerpoAgua> {
  const response = await axios.get(`${API_URL}/cuerpos-agua/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function createCuerpoAgua(data: CuerpoAguaCreate): Promise<CuerpoAgua> {
  const response = await axios.post(`${API_URL}/cuerpos-agua`, data, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function updateCuerpoAgua(id: number, data: CuerpoAguaUpdate): Promise<CuerpoAgua> {
  const response = await axios.patch(`${API_URL}/cuerpos-agua/${id}`, data, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function deleteCuerpoAgua(id: number): Promise<void> {
  await axios.delete(`${API_URL}/cuerpos-agua/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
}