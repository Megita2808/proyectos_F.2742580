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
}

const EditarRol = async (
  _id: string,
  nombreRol: string,
  extraPorcentaje: number,
  permisos: DatoPermiso[],
): Promise<DatoRol | void> => {

  if (typeof _id !== 'string') {
    console.error('El identificador debe ser un string');
    return;
  }

  try {
    const response: AxiosResponse<DatoRol> = await axios2.put<DatoRol>('/api/rol/'+_id, {
      nombreRol,
      extraPorcentaje: 0,
      permisos
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

export default EditarRol;
