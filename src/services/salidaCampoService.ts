import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

export interface SalidaCampo {
  id_salida_campo: number
  nombre: string
  descripcion: string
  fecha_inicio: string
  fecha_fin: string
  fecha_creacion: string
  estado: string
  id_usuario_creador: number
  ids_tecnicos: number[]
  ids_cuerpos_agua: number[]
}

export interface SalidaCampoCreate {
  nombre: string
  descripcion: string
  fecha_inicio: string
  fecha_fin: string
  fecha_creacion: string
  estado: string
  id_usuario_creador: number
  ids_tecnicos: number[]
  ids_cuerpos_agua: number[]
}

export interface SalidaCampoUpdate {
  nombre?: string
  descripcion?: string
  fecha_inicio?: string
  fecha_fin?: string
  estado?: string
  id_usuario_creador?: number
  ids_tecnicos?: number[]
  ids_cuerpos_agua?: number[]
}

export const listSalidasCampo = async (): Promise<SalidaCampo[]> => {
  const response = await axios.get(`${API_URL}/salidas-campo`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const getSalidaCampo = async (id: number): Promise<SalidaCampo> => {
  const response = await axios.get(`${API_URL}/salidas-campo/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const createSalidaCampo = async (data: SalidaCampoCreate): Promise<SalidaCampo> => {
  const response = await axios.post(`${API_URL}/salidas-campo`, data, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const updateSalidaCampo = async (id: number, data: SalidaCampoUpdate): Promise<SalidaCampo> => {
  const response = await axios.patch(`${API_URL}/salidas-campo/${id}`, data, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const deleteSalidaCampo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/salidas-campo/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
};