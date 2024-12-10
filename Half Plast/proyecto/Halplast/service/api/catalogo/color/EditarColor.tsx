import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosColor {
  nombreColor: string;
  _id: string;
}

const EditarColor = async (
  nombreColor: string, 
  _id: string
): Promise<DatosColor | void> => {

  if (nombreColor.length < 2) {
    console.error('El color debe tener al menos 1 digito');
    return
  }

  try {
    const response: AxiosResponse<DatosColor> = await axios2.put<DatosColor>('/api/color/'+_id, {
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

export default EditarColor;
