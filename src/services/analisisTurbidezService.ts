import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

export interface AnalisisTurbidez {
    id_analisis_turbidez: number
    valor_ntu: number
    clasificacion: string
    observaciones: string
    fecha_analisis: string
    id_muestreo: number
}

export interface AnalisisTurbidezCreate {
    valor_ntu: number
    clasificacion: string
    observaciones: string
    fecha_analisis: string
    id_muestreo: number
}

export interface AnalisisTurbidezUpdate {
    valor_ntu?: number
    clasificacion?: string
    observaciones?: string
    fecha_analisis?: string
    id_muestreo?: number
}

export async function listAnalisisTurbidez(): Promise<AnalisisTurbidez[]> {
    const response = await axios.get(`${API_URL}/analisis-turbidez`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
}

export async function getAnalisisTurbidezById(id: number): Promise<AnalisisTurbidez> {
    const response = await axios.get(`${API_URL}/analisis-turbidez/${id}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
}

export async function createAnalisisTurbidez(data: AnalisisTurbidezCreate): Promise<AnalisisTurbidez> {
    const response = await axios.post(`${API_URL}/analisis-turbidez`, data, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
}

export async function updateAnalisisTurbidez(id: number, data: AnalisisTurbidezUpdate): Promise<AnalisisTurbidez> {
    const response = await axios.patch(`${API_URL}/analisis-turbidez/${id}`, data, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
}

export async function deleteAnalisisTurbidez(id: number): Promise<void> {
    await axios.delete(`${API_URL}/analisis-turbidez/${id}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
}

export async function getAnalisisTurbidezByMuestreo(idMuestreo: number): Promise<AnalisisTurbidez[]> {
    const response = await axios.get(`${API_URL}/analisis-turbidez/muestreo/${idMuestreo}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
}