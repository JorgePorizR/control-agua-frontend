import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

export interface ImagenCuerpoAgua {
  id_imagen: number
  nombre_archivo: string
  ruta_archivo: string
  descripcion: string
  fecha_subida: string
  id_cuerpo_agua: number
}

export interface ImagenCuerpoAguaCreate {
  file: File;
  descripcion: string;
  id_cuerpo_agua: number;
}

export async function listImagenesCuerpoAgua(idCuerpoAgua: number): Promise<ImagenCuerpoAgua[]> {
  const response = await axios.get(`${API_URL}/imagenes-cuerpo-agua/cuerpo-agua/${idCuerpoAgua}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function createImagenCuerpoAgua(data: ImagenCuerpoAguaCreate): Promise<ImagenCuerpoAgua> {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("descripcion", data.descripcion);
  formData.append("id_cuerpo_agua", data.id_cuerpo_agua.toString());

  const response = await axios.post(`${API_URL}/imagenes-cuerpo-agua`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function deleteImagenCuerpoAgua(id: number): Promise<void> {
  await axios.delete(`${API_URL}/imagenes-cuerpo-agua/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
}