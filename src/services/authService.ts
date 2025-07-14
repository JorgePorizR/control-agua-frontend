import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ResponseLogin {
  token: string;
  type: string;
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  es_admin: boolean;
}

export async function login(
  credentials: LoginCredentials
): Promise<ResponseLogin> {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
}

export async function logout(): Promise<void> {
  sessionStorage.clear();
  console.log("User logged out");
  window.location.href = "/login"; // Redirect to login page
  return;
}
