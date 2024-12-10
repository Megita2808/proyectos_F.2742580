import  { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface Datos {
  _id: string;
  estado: boolean;
}

const CambiarEstado = async (value: boolean, id: string, modulo: string): Promise<Datos | null> => {
  try {
    const url = `/api/${modulo}/estado/${id}`;

    const response: AxiosResponse<Datos> = await axios2.put<Datos>(url, { estado: value });
    console.log('parte respuesta')
    console.log(response)
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Error en la respuesta:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
    return null;
  }
};

export default CambiarEstado;
