import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

export interface AnalisisCaudal {
    id_analisis_caudal: number
    ancho_metros: number
    profundidad_media_metros: number
    velocidad_media_ms: number
    area_m2: number
    caudal_m3s: number
    observaciones: string
    fecha_analisis: string
    id_muestreo: number
}

export interface AnalisisCaudalCreate {
    ancho_metros: number
    profundidad_media_metros: number
    velocidad_media_ms: number 
    area_m2: number
    caudal_m3s: number
    observaciones: string
    fecha_analisis: string
    id_muestreo: number
}

export interface AnalisisCaudalUpdate {
    ancho_metros?: number
    profundidad_media_metros?: number
    velocidad_media_ms?: number
    area_m2?: number
    caudal_m3s?: number
    observaciones?: string
    fecha_analisis?: string
    id_muestreo?: number
}

export async function listAnalisisCaudal(): Promise<AnalisisCaudal[]> {
    const response = await axios.get(`${API_URL}/analisis-caudal`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
}

export async function getAnalisisCaudalById(id: number): Promise<AnalisisCaudal> {
    const response = await axios.get(`${API_URL}/analisis-caudal/${id}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
}

export async function createAnalisisCaudal(data: AnalisisCaudalCreate): Promise<AnalisisCaudal> {
    const response = await axios.post(`${API_URL}/analisis-caudal`, data, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
}

export async function updateAnalisisCaudal(id: number, data: AnalisisCaudalUpdate): Promise<AnalisisCaudal> {
    const response = await axios.patch(`${API_URL}/analisis-caudal/${id}`, data, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
}

export async function deleteAnalisisCaudal(id: number): Promise<void> {
    await axios.delete(`${API_URL}/analisis-caudal/${id}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
}

export async function getAnalisisCaudalByMuestreo(idMuestreo: number): Promise<AnalisisCaudal[]> {
    const response = await axios.get(`${API_URL}/analisis-caudal/muestreo/${idMuestreo}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
}
