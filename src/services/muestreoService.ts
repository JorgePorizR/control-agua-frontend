import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

export interface Muestreo {
  id_muestreo: number
  fecha_muestreo: string
  observaciones: string
  id_salida_campo: number
  id_cuerpo_agua: number
  id_tecnico: number
}

export interface MuestreoCreate {
  fecha_muestreo: string
  observaciones: string
  id_salida_campo: number
  id_cuerpo_agua: number
  id_tecnico: number
}

export interface MuestreoUpdate {
  observaciones?: string
  id_salida_campo?: number
  id_cuerpo_agua?: number
  id_tecnico?: number
}