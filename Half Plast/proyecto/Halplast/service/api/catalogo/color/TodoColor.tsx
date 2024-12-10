import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface Color {
  _id: string;
  nombreColor: string;
  estado: boolean;
}

interface GetColorResponse {
  colores: Color[];
}

export const getColores = async (): Promise<Color[]> => {
  try {
    const response: AxiosResponse<GetColorResponse> = await axios2.get<GetColorResponse>('/api/color');
    return response.data.colores;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return [];
  }
};