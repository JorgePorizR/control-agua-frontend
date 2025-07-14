import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

export interface ImgMuestreo {
    id_imagen_muestreo: number
    nombre_archivo: string
    ruta_archivo: string
    descripcion: string
    fecha_subida: string
    id_muestreo: number
}

export interface ImgMuestreoCreate {
    file: File
    descripcion: string
    id_muestreo: number
}

export async function listImagenesMuestreo(idMuestreo: number): Promise<ImgMuestreo[]> {
    const response = await axios.get(`${API_URL}/imagenes-muestreo/muestreo/${idMuestreo}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
}

export async function createImagenMuestreo(data: ImgMuestreoCreate): Promise<ImgMuestreo> {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("descripcion", data.descripcion);
    formData.append("id_muestreo", data.id_muestreo.toString());

    const response = await axios.post(`${API_URL}/imagenes-muestreo`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
}

export async function deleteImagenMuestreo(id: number): Promise<void> {
    await axios.delete(`${API_URL}/imagenes-muestreo/${id}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
}






