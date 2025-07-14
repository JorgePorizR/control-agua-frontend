import axios from "axios";

const API_URL = "http://localhost:8080/api";

export interface Departamento {
  id_departamento: number;
  nombre: string;
  descripcion: string;
}

export interface DepartamentoCreate {
  nombre: string;
  descripcion: string;
}

export interface DepartamentoUpdate {
  nombre?: string;
  descripcion?: string;
}

export interface Municipio {
  id_municipio: number;
  nombre: string;
  descripcion: string;
  id_departamento: number;
}

export interface MunicipioCreate {
  nombre: string;
  descripcion: string;
  id_departamento: number;
}

export interface MunicipioUpdate {
  nombre?: string;
  descripcion?: string;
  id_departamento?: number;
}

export interface Comunidad {
  id_comunidad: number;
  nombre: string;
  descripcion: string;
  id_municipio: number;
}

export interface ComunidadCreate {
  nombre: string;
  descripcion: string;
  id_municipio: number;
}

export interface ComunidadUpdate {
  nombre?: string;
  descripcion?: string;
  id_municipio?: number;
}

export async function listDepartamentos(): Promise<Departamento[]> {
  const response = await axios.get(`${API_URL}/departamentos`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function getDepartamentoById(id: number): Promise<Departamento> {
  const response = await axios.get(`${API_URL}/departamentos/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function createDepartamento(
  departamento: DepartamentoCreate
): Promise<Departamento> {
  const response = await axios.post(`${API_URL}/departamentos`, departamento, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function updateDepartamento(
  id: number,
  departamento: DepartamentoUpdate
): Promise<Departamento> {
  const response = await axios.patch(
    `${API_URL}/departamentos/${id}`,
    departamento,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
}

export async function deleteDepartamento(id: number): Promise<void> {
  await axios.delete(`${API_URL}/departamentos/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
}

export async function listMunicipios(): Promise<Municipio[]> {
  const response = await axios.get(`${API_URL}/municipios`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function getMunicipioById(id: number): Promise<Municipio> {
  const response = await axios.get(`${API_URL}/municipios/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function createMunicipio(
  municipio: MunicipioCreate
): Promise<Municipio> {
  const response = await axios.post(`${API_URL}/municipios`, municipio, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function updateMunicipio(
  id: number,
  municipio: MunicipioUpdate
): Promise<Municipio> {
  const response = await axios.patch(`${API_URL}/municipios/${id}`, municipio, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function deleteMunicipio(id: number): Promise<void> {
  await axios.delete(`${API_URL}/municipios/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
}

export async function listComunidades(): Promise<Comunidad[]> {
  const response = await axios.get(`${API_URL}/comunidades`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function getComunidadById(id: number): Promise<Comunidad> {
  const response = await axios.get(`${API_URL}/comunidades/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function createComunidad(
  comunidad: ComunidadCreate
): Promise<Comunidad> {
  const response = await axios.post(`${API_URL}/comunidades`, comunidad, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function updateComunidad(
  id: number,
  comunidad: ComunidadUpdate
): Promise<Comunidad> {
  const response = await axios.patch(
    `${API_URL}/comunidades/${id}`,
    comunidad,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
}

export async function deleteComunidad(id: number): Promise<void> {
  await axios.delete(`${API_URL}/comunidades/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
}
