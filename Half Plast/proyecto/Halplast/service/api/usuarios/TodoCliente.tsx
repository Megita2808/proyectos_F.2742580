import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

import { Direccion } from "@/service/api/compra/proveedor/TodoProveedor";

export interface dataRol {
  _id: string;
  nombreRol: string;
  extraPorcentaje: number;
}

export interface DataRowCliente{
  _id: string;
  nombre: string;
  correo: string;
  telefono:string;
  rol: dataRol;
  estado: boolean;
  direccion: Direccion[];
}

interface GetPesoResponse {
  usuarios: DataRowCliente[];
}

export const getClientes = async (): Promise<DataRowCliente[]> => {
  try {
    const response: AxiosResponse<GetPesoResponse> = await axios2.get<GetPesoResponse>('/api/usuarios');
    return response.data.usuarios;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return [];
  }
};