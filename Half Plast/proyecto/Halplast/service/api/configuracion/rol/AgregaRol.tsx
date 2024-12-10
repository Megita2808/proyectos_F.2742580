import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatoPermiso {
  nombrePermiso: string;
  descripcionPermiso: string;
}

interface DatoRol {
  nombreRol: string;
  extraPorcentaje: number;
  permisos: DatoPermiso[];
}

const AgregarRol = async (
  nombreRol: string, 
  extraPorcentaje: number,
  permisos: DatoPermiso[],
): Promise<DatoRol | void> => {


  try {
    const response: AxiosResponse<DatoRol> = await axios2.post<DatoRol>('/api/rol' ,{
      nombreRol,
      extraPorcentaje: 0,
      permisos,
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

export default AgregarRol;
