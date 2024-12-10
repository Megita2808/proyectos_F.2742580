import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

export interface DatoPermiso {
  _id: string;
  nombrePermiso: string;
  descripcionPermiso: string;
}

interface DatoRol {
  _id: string;
  nombreRol: string;
  extraPorcentaje: number;
  permisos: DatoPermiso[];
  estado: boolean;
}

interface GetPesoResponse {
  roles: DatoRol[];
}

export const getRoles = async (): Promise<DatoRol[]> => {
  try {
    const response: AxiosResponse<GetPesoResponse> = await axios2.get<GetPesoResponse>('/api/roles');
    return response.data.roles;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return [];
  }
};