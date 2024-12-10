import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosCategoria {
  nombreCategoria: string;
  _id: string;
  imagen: string;
}

const EditarCategoria = async (
  nombreCategoria: string, 
  _id: string,
  imagen: string,
): Promise<DatosCategoria | void> => {

  if (nombreCategoria.length < 2) {
    console.error('El nombre de la categoria deberia tener al menos 1 digito');
    return
  }

  try {
    const response: AxiosResponse<DatosCategoria> = await axios2.put<DatosCategoria>('/api/categoria/'+_id, {
      nombreCategoria,
      imagen,
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

export default EditarCategoria;
