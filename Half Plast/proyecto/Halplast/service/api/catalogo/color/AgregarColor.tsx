import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatoColor {
  nombreColor: string;
}

const AgregarColor = async (
  nombreColor: string, 
): Promise<DatoColor | void> => {

  if (nombreColor.length < 2) {
    console.error('El color debe tener al menos 1 digito');
    return
  }

  try {
    const response: AxiosResponse<DatoColor> = await axios2.post<DatoColor>('/api/color' ,{
      nombreColor,
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
