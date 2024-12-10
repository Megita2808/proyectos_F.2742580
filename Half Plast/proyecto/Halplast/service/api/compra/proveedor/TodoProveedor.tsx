import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

export interface Coordenadas {
  latitud: number;
  longitud: number;
}

export interface Locacion {
  coordenadas: Coordenadas;
  locacion: string;
  estado: boolean;
  _id: string;
}

export interface Direccion {
  departamento: string;
  ciudad: string;
  locaciones: Locacion[];
}

export interface DataRowProveedor{
  _id: string;
  nombre: string,
  correo: string,
  telefono: string,
  tipoDocumento: string,
  documento: string,
  estado: boolean;
  direccion: Direccion[];
}

interface GetProveedorResponse {
  proveedores: DataRowProveedor[];
}

export const getProveedores = async (): Promise<DataRowProveedor[]> => {
  try {
    const response: AxiosResponse<GetProveedorResponse> = await axios2.get<GetProveedorResponse>('/api/proveedor');
    return response.data.proveedores;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return [];
  }
};