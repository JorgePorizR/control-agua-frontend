import axios from "axios";

const API_URL = "http://localhost:8080/api";

export interface RegisterCredentials {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: string;
  es_admin: boolean;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  es_activo: boolean;
  rol: string;
  es_admin: boolean;
}

export interface UsuarioUpdate {
  nombre?: string;
  apellido?: string;
  email?: string;
  es_activo?: boolean;
  rol?: string;
  es_admin?: boolean;
}

export async function listUsers(): Promise<Usuario[]> {
  const response = await axios.get(`${API_URL}/usuarios`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function getUserById(id: number): Promise<Usuario> {
  const response = await axios.get(`${API_URL}/usuarios/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function register(
  credentials: RegisterCredentials
): Promise<Usuario> {
  const response = await axios.post(`${API_URL}/auth/register`, credentials, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function updateUser(
  id: number,
  userData: UsuarioUpdate
): Promise<Usuario> {
  const response = await axios.patch(`${API_URL}/usuarios/${id}`, userData, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await axios.delete(`${API_URL}/usuarios/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
}
