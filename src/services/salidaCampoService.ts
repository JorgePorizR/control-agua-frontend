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