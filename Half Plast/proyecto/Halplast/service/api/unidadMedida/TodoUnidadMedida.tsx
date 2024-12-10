import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface UnidadMedida {
  _id: string;
  nombre: string;
  simbolo: string;
  estado: boolean;
  tipo: string;
}

interface GetUnidadMedidaResponse {
  unidadesMedida: UnidadMedida[];
}

export const getUnidadMedida = async (): Promise<UnidadMedida[]> => {
  try {
    const response: AxiosResponse<GetUnidadMedidaResponse> = await axios2.get<GetUnidadMedidaResponse>('/api/unidadMedida');
    return response.data.unidadesMedida;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return [];
  }
};
