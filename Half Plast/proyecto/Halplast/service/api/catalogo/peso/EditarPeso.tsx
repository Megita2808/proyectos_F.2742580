import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosPeso {
  peso: number;
  _id: string;
  unidadMedida: string
}

const EditarPeso = async (
  peso: number, 
  _id: string,
  unidadMedida: string, 
): Promise<DatosPeso | void> => {

  if (peso <= 0) {
    console.error('El peso debe ser mayor a cero');
    return
  }

  try {
    const response: AxiosResponse<DatosPeso> = await axios2.put<DatosPeso>('/api/peso/'+_id, {
      peso,
      unidadMedida
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

export default EditarPeso;
