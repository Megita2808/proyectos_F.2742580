import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatoColor {
  peso: number;
  unidadMedida: string, 
}

const AgregarColor = async (
  peso: number, 
  unidadMedida: string, 
): Promise<DatoColor | void> => {

  if (peso <= 0) {
    console.error('El peso debe ser mayor a 0');
    return
  }

  try {
    const response: AxiosResponse<DatoColor> = await axios2.post<DatoColor>('/api/peso' ,{
      peso,
      unidadMedida,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default AgregarColor;
