import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosColor {
  _id: string;
}

const EliminarColor= async ( 
  _id: string
): Promise<DatosColor | void> => {

  if (typeof _id !== 'string') {
    console.error('El id debe ser string');
    return 
  }

  try {
    const response: AxiosResponse<DatosColor> = await axios2.delete<DatosColor>('/api/color/'+_id);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default EliminarColor;
