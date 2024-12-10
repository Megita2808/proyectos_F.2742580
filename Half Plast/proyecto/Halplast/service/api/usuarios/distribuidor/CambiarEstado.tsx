import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosEstado {
  _id: string;
  estado: string;
}

const EditarEstado = async (
  _id: string,
  estado: string
): Promise<number> => {
  if (!_id || typeof _id !== 'string') {
    console.error('El id debe ser un string válido');
    return 400;
  }

  if (!estado || typeof estado !== 'string') {
    console.error('El estado debe ser un string válido');
    return 400;
  }

  try {
    const response: AxiosResponse<DatosEstado> = await axios2.put<DatosEstado>(
      `/api/distribuidor/estado/${_id}`,
      { estado }
    );

    return response.status;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }

    return 500;
  }
};

export default EditarEstado;
